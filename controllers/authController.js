const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');


const User = require('./../models/userModel');

const catchAsync = require('../utilities/catchAsync');
const AppError = require('./../utilities/appError');
const sendEmail = require('./../utilities/email');
const Email = require('./../utilities/emailClass');

const { filterObj } = require('./../utilities/filterObject');



///		Reusable JWT Token functions		///


///	create token	///


const signToken = (userId) => {

	return jwt.sign(

		{ id: userId },

		process.env.JWT_SECRET_KEY,

		{ expiresIn: process.env.JWT_EXPIRY }
	)
}



/// create response - statusCode / token / data 


const createSendToken = (user, statusCode, res) => {

	const token = signToken(user._id);

	const cookieOptions = {

		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
		httpOnly: true
	}

	if (process.env.NODE_ENV === 'production') {

		cookieOptions.secure = true;
	}

	res.cookie('jwt', token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({

		status: 'success',
		token,
		data: {
			user
		}
	})
}





///			Signup			///


exports.signupUser = catchAsync(async (req, res, next) => {

	const newUser = await User.create({

		name: req.body.name && req.body.name.trim(),
		email: req.body.email && req.body.email.trim(),
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm

	});


	newUser.lastLoggedIn = new Date();

	await newUser.save({ validateBeforeSave: false });

	///			Send Welcome Email			///


	const url = `${req.protocol}://${req.get('host')}/my-account/${newUser._id}`

	/// 	Still need to add '/me' route to viewRoutes 	///

	await new Email(newUser, url).sendWelcome();

	createSendToken(newUser, 201, res);
})




///			Login			///


exports.loginUser = catchAsync(async (req, res, next) => {

	const { email, password } = req.body;

	if (!email || !password) return next(new AppError('User details Incorrect. Please Try Again!', 404));

	const user = await User.findOne({ email: email }).select('+password');

	if (!user || !await user.correctPassword(password, user.password)) {

		return next(new AppError('User Credentials Incorrect. Please try again!', 401));

	}

	createSendToken(user, 200, res);

})



/// Check If IsLoggedIn



exports.isLoggedIn = async (req, res, next) => {

	if (req.cookies.jwt) {

		try {

			const decodedToken = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET_KEY);

			const existingUser = await User.findById(decodedToken.id);

			if (!existingUser) return next();

			if (existingUser.passwordChangedAfter(decodedToken.iat)) {

				return next();
			}

			res.locals.user = existingUser;
			req.user = existingUser;

			return next();

		} catch (err) {

			return next()
		}
	}
	next()
}



/// logout


exports.logout = (req, res) => {

	res.cookie('jwt', 'loggedOutToken', {

		expiresIn: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});
	res.status(200).json({
		status: 'success'
	})
}







///		Protected Routes		///



exports.protectRoute = catchAsync(async (req, res, next) => {


	let token;


	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

		token = req.headers.authorization.split(' ')[1];

	} else if (req.cookies.jwt) {

		token = req.cookies.jwt
	}


	if (!token) return next(new AppError('No Token Exists!', 401));


	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

	const existingUser = await User.findById(decoded.id);

	if (!existingUser) return next(new AppError('No existing user for this token! Please Login again!', 401))



	if (existingUser.passwordChangedAfter(decoded.iat)) {

		return next(new AppError('Pasword changed recently - Please login again!', 401));

	}


	req.user = existingUser;

	next();
})



//-------------- Authorization -------------//


exports.restrictTo = (...roles) => {

	return (req, res, next) => {

		if (!roles.includes(req.user.role)) {

			return next(new AppError(`${req.user.name.split(" ")[0]} does not have permission for this action`, 403));
		}

		next();
	}
}



//-------------- Password Functionality -------------//


exports.forgotPassword = catchAsync(async (req, res, next) => {

	const user = await User.findOne({ email: req.body.email });

	if (!user) {

		return next(new AppError('No user found with that email', 404));
	}

	const resetToken = user.createPasswordResetToken();

	await user.save({ validateBeforeSave: false });

	try {

		const resetUrl = `${resetToken}`;

		await new Email(user, resetUrl).resetPassword();

		res.status(200).json({

			status: "success",
			message: 'Token Sent'
		})
	}

	catch (err) {

		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new AppError('Error sending email. Please try again', 500));
	}
});







exports.resetPassword = catchAsync(async (req, res, next) => {

	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({

		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() }
	})

	if (!user) { return next(new AppError('Invalid Token'), 400) };

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	createSendToken(user, 200, res);

})





exports.updateLoggedinPassword = catchAsync(async (req, res, next) => {

	const user = await User.findById(req.user.id).select('+password');

	if (!user || !await user.correctPassword(req.body.passwordCurrent, user.password)) {

		return next(new AppError('Current Password is incorrect',))

	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	await user.save();

	res.status(200).json({

		status: "success"
	})

})





exports.updateMe = catchAsync(async (req, res, next) => {

	if (req.body.password || req.body.passwordConfirm) {

		return next(new AppError('Do Not Update Password Here - update thru Update Password!', 400))
	}


	const filteredBody = filterObj(req.body, 'name', 'email', 'phone');


	const updatedUser = await User.findByIdAndUpdate(

		req.user.id,

		filteredBody,

		{ new: true },

		{ runValidators: true }
	)
	res.status(200).json({

		status: "success",

		data: {
			user: updatedUser
		}
	})
})





exports.deleteMe = catchAsync(async (req, res, next) => {

	const user = await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(200).json({

		status: "success",
		data: { user }
	})
})





