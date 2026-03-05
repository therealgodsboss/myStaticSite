const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const userSchema = new mongoose.Schema({

	name: {

		type: String,
		required: [true, 'A User must have a name']
	},

	email: {

		type: String,
		required: [true, 'A User must have an Email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid Email']
	},

	phone: {

		type: String,
		validate: [validator.isMobilePhone, 'Please enter a valid phone number']
	},

	role: {

		type: String,
		enum: ['user', 'admin', 'supervisor', 'owner'],
		default: 'user'
	},


	password: {

		type: String,
		required: [true, 'A User must have a Password'],
		minLength: [8, 'Password must be at least 8 Characters'],

		/// Wont show up in queries ⬇️

		select: false

	},

	passwordConfirm: {

		type: String,
		required: [true, 'Please confirm Password'],

		validate: function (pwConfirm) {

			return pwConfirm === this.password
		},

		message: 'Passwords do not match!'
	},


	passwordChangedAt: Date,

	passwordResetToken: String,

	passwordResetExpires: Date,

	lastLoggedIn: Date,

	addresses: {

		/// using type as were setting a default field

		type: [
			{
				label: {
					type: String,
					enum: ['Home', 'Work', 'Other'],
					required: true,
					default: 'Home'

				},
				number: {
					type: String,
					required: false
				},
				street: String,
				city: String,
				state: String,

				postcode: {
					type: String,
					minLength: 4,
					maxLength: 4
				},
				isDefault: {
					type: Boolean,
					default: false
				}
			}
		],

		default: []
	},


	wishlist: [

		/// not using type as were not setting a default field 

		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: true
			},

			quantity: {
				type: Number,
				default: 1,
				min: 1
			},

			addedAt: {
				type: Date,
				default: Date.now
			}
		}
	],

	cart: [
		{
			product: {

				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: true
			},

			quantity: {
				type: Number,
				default: 1,
				min: 1
			},

			addedAt: {
				type: Date,
				default: Date.now
			}
		}
	],

	active: {

		type: Boolean,
		default: true,
		select: false
	}
},
	{
		timestamps: true
	}
)





//-----		Middleware -----//


/// encrypt Password


userSchema.pre('save', async function (next) {

	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;

	next();
});




//----	Instance Methods	-----//


/// use an instance method to return a true or false boolean on whether passwords match


userSchema.methods.correctPassword = async function (inputPassword, savedPassword) {

	return await bcrypt.compare(inputPassword, savedPassword);


}


/// Check for password change after token jwt token issued


userSchema.methods.passwordChangedAfter = function (jwtIssuedAt) {

	if (this.passwordChangedAt) {

		const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		return jwtIssuedAt < changedTimeStamp;
	}

	return false;
}


///	Genereate random token using inbuilt crypto package and save to passwordResetToken for comparison in crypto function


userSchema.methods.createPasswordResetToken = function () {

	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
}



/// update passwordChangedAt property


userSchema.pre('save', function (next) {

	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;

	next();
})





const User = mongoose.model('User', userSchema);

module.exports = User;