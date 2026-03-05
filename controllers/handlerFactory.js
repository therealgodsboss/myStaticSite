const mongoose = require('mongoose');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('./../utilities/appError');
const APIFeatures = require('./../utilities/apiFeatures');




/// Set user and Product Parameters for assigning


exports.setUserAndProductParams = (req, res, next) => {

	if (!req.body.product) req.body.product = req.params.productId;
	if (!req.body.user) req.body.user = req.user.id;

	next();
}





/// CRUD		



///		Create	



exports.createOne = (Model) => catchAsync(async (req, res, next) => {

	if (req.file) req.body.image = req.file.filename;

	const doc = await Model.create(req.body);

	res.status(200).json({

		status: 'success',
		doc
	})
})



///		Read	



exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {

	let query = Model.findById(req.params.id);

	if (populateOptions) {

		query = query.populate(populateOptions);

	}

	const doc = await query;

	if (!doc) return next(new AppError('No Product Found', 404));

	res.status(200).json({
		status: 'success',
		doc
	})
})






exports.getAll = (Model) => catchAsync(async (req, res, next) => {


	let filter = {};

	if (req.params.productId) filter = { product: req.params.productId }

	const features = new APIFeatures(Model.find(filter), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();


	const doc = await features.query

	res.status(200).json({

		status: "success",
		doc
	})

})







///		Update	


exports.updateOne = (Model) => catchAsync(async (req, res, next) => {

	///			CHECKS			///

	if (req.body.category === '' || req.body.category === undefined) req.body.category = null;
	if (req.body.discount === '' || req.body.discount === undefined) req.body.discount = null;

	if (req.file) {

		req.body.imageCover = req.file.filename;
	}

	if (req.body.discount && req.body.discount.length === 24) {

		req.body.discount = new mongoose.Types.ObjectId(req.body.discount);

	} else {

		req.body.discount = null;
	}

	///	////////////////////	///

	const doc = await Model.findByIdAndUpdate(

		req.params.id,
		req.body,

		{
			new: true,
			runValidators: true
		}
	)

	if (!doc) return next(new AppError('No Document Found', 404))

	res.status(200).json({

		status: 'success',
		doc
	})
})


///		delete	


exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {

	const doc = await Model.findByIdAndDelete(req.params.id);

	if (!doc) return next(new AppError('No Document Found', 404))

	res.status(200).json({

		status: 'success'

	})
})


