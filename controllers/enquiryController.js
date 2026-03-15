const Enquiry = require('./../models/enquiryModel');
const catchAsync = require('./../utilities/catchAsync');
const Email = require('./../utilities/emailClass');

exports.createEnquiry = catchAsync(async (req, res, next) => {

	const newEnquiry = await Enquiry.create({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		enquiry: req.body.enquiry,
		message: req.body.message
	});

	const url = `${req.protocol}://${req.get('host')}/`;

	res.redirect(303, '/enquiry-success');

	new Email(newEnquiry, url).enquiryEmail().catch(err => {
		console.error('Enquiry email failed:', err.response || err);
	});

});
