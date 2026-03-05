const catchAsync = require('./../../utilities/catchAsync');
const AppError = require('./../../utilities/appError');



/// page function


const pageFunction = (page) =>

	(req, res) => {

		res.status(200).render(page, {

			pageTitle: page,
			pageDescription: `${page} Page`,
			canonicalUrl: `${process.env.CANONICAL_URL}/${page} `
		})
	}




/// find() page function with populate()



const findPageFunction = (Model, page, populateOptions) =>

	catchAsync(async (req, res) => {

		let query = Model.find();

		if (populateOptions) {

			query = query.populate(populateOptions);
		}


		const results = await query;

		res.status(200).render(page, {

			pageTitle: page,
			pageDescription: `${page} Page`,
			canonicalUrl: `${process.env.CANONICAL_URL}/${page} `,
			results
		})
	})




module.exports = { pageFunction, findPageFunction };

