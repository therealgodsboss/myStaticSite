
const catchAsync = require('./../utilities/catchAsync');

const User = require('./../models/userModel');





//-------------------		Function Imports 	---------------------//

const { backendPageFunction } = require('./../public/js/backendFunctions');

const { pageFunction } = require('./../public/js/frontendFunctions');




//----------------------------- Pages ----------------------------//


//--------------- User Credentials Pages -------------------//


exports.loginPage = pageFunction('login');


exports.resetPasswordPage = pageFunction('reset-password');




//--------------------- Home Page --------------------------//



exports.getHomePage = catchAsync(async (req, res, next) => {

	res.status(200).render('homepage', {

		pageTitle: 'Websites for Local Businesses in Wide Bay | Widebay Web Wise',
		pageDescription:
			'Custom-built websites for local businesses across the Wide Bay region, including Bundaberg, Hervey Bay, and Maryborough. Fast, modern, mobile-friendly websites designed to help your business get found online.',
		canonicalUrl: `${process.env.CANONICAL_URL}/`
	});
});




//----------------------- Static Pages --------------------------//


//------------------- Services Page ------------------------//


exports.getServicesPage = catchAsync(async (req, res, next) => {

	res.status(200).render('services', {

		pageTitle: 'Website Services for Local Businesses in Wide Bay | Widebay Web Wise',
		pageDescription:
			'Explore custom website services for local businesses across Wide Bay, including Bundaberg, Hervey Bay, and Maryborough. Professional brochure, enquiry, and small business websites built to help you get found online.',
		canonicalUrl: `${process.env.CANONICAL_URL}/services`
	});
});



//------------------- Portfolio Page ------------------------//


exports.getPortfolioPage = catchAsync(async (req, res, next) => {

	res.status(200).render('portfolio', {

		pageTitle: 'Website Design Portfolio | Wide Bay & Bundaberg | Widebay Web Wise',
		pageDescription:
			'View recent website projects and examples of custom-built work from Widebay Web Wise. Professional websites designed for local businesses across Wide Bay, including Bundaberg, Hervey Bay, and Maryborough.',
		canonicalUrl: `${process.env.CANONICAL_URL}/portfolio`

	});
});


//------------------- About Page ------------------------//


exports.getAboutPage = catchAsync(async (req, res, next) => {

	res.status(200).render('about', {

		pageTitle: 'About Widebay Web Wise | Local Website Design in Wide Bay',
		pageDescription:
			'Learn more about Widebay Web Wise and our practical approach to building custom websites for local businesses across Wide Bay, including Bundaberg, Hervey Bay, and Maryborough.',
		canonicalUrl: `${process.env.CANONICAL_URL}/about`
	});
});


//------------------- Contact Page ------------------------//


exports.getContactPage = catchAsync(async (req, res, next) => {

	res.status(200).render('contact', {

		pageTitle: 'Contact Widebay Web Wise | Website Design in Wide Bay',
		pageDescription:
			'Get in touch with Widebay Web Wise about a custom website for your business. Serving local businesses across Wide Bay, including Bundaberg, Hervey Bay, and Maryborough.',
		canonicalUrl: `${process.env.CANONICAL_URL}/contact`
	});
});


exports.getEnquirySuccess = catchAsync(async (req, res, next) => {

	res.status(200).render('enquirySuccess', {

		pageTitle: 'Enquiry Sent | Widebay Web Wise',
		pageDescription: 'Your enquiry has been sent successfully. Widebay Web Wise will be in touch soon.',
		canonicalUrl: `${process.env.CANONICAL_URL}/enquiry-success`,
		noIndex: true
	});
});



//------------------------------------- ----- ---------------------------------------//
//------------------------------------- Admin ---------------------------------------//
//------------------------------------- ----- ---------------------------------------//


//--------------------- Pages --------------------------//


/// Home Page ///


exports.adminPage = backendPageFunction('be_home');





















