
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

		pageTitle: 'Home',
		pageDescription: 'Home Page for your website',
		canonicalUrl: `${process.env.CANONICAL_URL}`

	});
})





//----------------------- Static Pages --------------------------//


//--------------------- Services Page --------------------------//


exports.getServicesPage = pageFunction('services');


//--------------------- Portfolio Page --------------------------//


exports.getPortfolioPage = pageFunction('portfolio');



//--------------------- About Page --------------------------//


exports.getAboutPage = pageFunction('about');



//--------------------- Contact Page --------------------------//


exports.getContactPage = pageFunction('contact');






//------------------------------------- ----- ---------------------------------------//
//------------------------------------- Admin ---------------------------------------//
//------------------------------------- ----- ---------------------------------------//


//--------------------- Pages --------------------------//


/// Home Page ///


exports.adminPage = backendPageFunction('be_home');





















