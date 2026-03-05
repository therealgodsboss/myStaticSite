const User = require('./../models/userModel');

const factory = require('./handlerFactory');


const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/appError');




///			 Frontend functions			///


///  get logged in user info



exports.getMe = (req, res, next) => {

	/// assign parameter to user.id

	req.params.id = req.user.id;

	next();
}



exports.getUser = factory.getOne(User);




/// User create address


exports.createNewAddress = catchAsync(async (req, res, next) => {

	const { type, number, street, city, state, postcode, isDefault } = req.body;

	const user = await User.findById(req.user.id);

	const duplicate = user.addresses.some(addr => addr.label === type);


	if (duplicate) {

		return next(new AppError(`You already have an address labeled '${type}'`, 400));
	}


	if (isDefault === true) {

		await User.updateOne(

			{ _id: req.user.id, 'addresses.isDefault': true },

			{ $set: { 'addresses.$[elem].isDefault': false } },

			{ arrayFilters: [{ 'elem.isDefault': true }], multi: true }
		);
	}

	const newAddress = await User.findByIdAndUpdate(

		req.user.id,

		{
			$push: {
				addresses: {
					label: type,
					number: number,
					street: street,
					city: city,
					state: state,
					postcode: postcode,
					isDefault: isDefault
				}
			}
		},

		{ new: true, runValidators: true }
	);

	res.status(200).json({

		status: 'success',
		newAddress
	})
})





/// User Update address


exports.updateMyAddress = catchAsync(async (req, res, next) => {

	const { type, number, street, city, state, postcode, isDefault } = req.body;

	const addressId = req.params.addressId;

	const userId = req.params.userId || req.user.id;



	/// If isDefault value is true - remove current isDefault value

	if (isDefault === true) {

		await User.updateOne(

			{ _id: req.user.id, 'addresses.isDefault': true },

			{ $set: { 'addresses.$[elem].isDefault': false } },

			{ arrayFilters: [{ 'elem.isDefault': true }], multi: true }
		);
	}

	const addressUpdate = await User.updateOne(
		{
			_id: userId,
			'addresses._id': addressId
		},
		{
			/// $[elem] === addressId 

			$set: {
				'addresses.$[elem].type': type,
				'addresses.$[elem].number': number,
				'addresses.$[elem].street': street,
				'addresses.$[elem].city': city,
				'addresses.$[elem].state': state,
				'addresses.$[elem].postcode': postcode,
				'addresses.$[elem].isDefault': isDefault
			}
		},
		{
			/// $[elem] === addressId 

			arrayFilters: [{ 'elem._id': addressId }]
		}
	)

	res.status(200).json({

		status: 'success',
		addressUpdate
	})
})


exports.deleteAnAddress = catchAsync(async (req, res, next) => {

	const addressId = req.params.addressId;


	await User.findOneAndUpdate(

		{ _id: req.user.id, 'addresses._id': addressId },

		{ $pull: { addresses: { _id: addressId } } },

		{ new: true }
	);

	res.status(200).json({

		status: 'success'
	})
}
)







///			 Backend functions			///


exports.createBeUser = factory.createOne(User);

exports.getAllUser = factory.getAll(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
