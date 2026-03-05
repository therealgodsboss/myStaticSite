const catchAsync = require('./../../utilities/catchAsync');
const AppError = require('./../../utilities/appError');

const backendPageFunction = (page) =>

	(req, res) => {

		res.status(200).render(`admin/${page}`, {

			pageTitle: page,
			pageDescription: `${page} Page`,
			canonicalUrl: `${process.env.CANONICAL_URL}/${page} `
		})
	}


const backendFindPageFunction = (Model, page, populateOptions, populateOptionsTwo) =>

	catchAsync(async (req, res) => {

		const results = await Model.find().populate(populateOptions).populate(populateOptionsTwo);

		res.status(200).render(`admin/${page}`, {

			pageTitle: page,
			pageDescription: `${page} Page`,
			canonicalUrl: `${process.env.CANONICAL_URL}/${page} `,
			results
		})
	})



const backendFindByIdFunction = (Model, page) => catchAsync(async (req, res) => {

	const result = await Model.findById(req.params.id);

	res.status(200).render(`admin/${page}`, {

		title: `Admin-${page}`,
		result

	})
})








module.exports = { backendFindPageFunction, backendFindByIdFunction, backendPageFunction };

