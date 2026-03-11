const express = require('express');
const router = express.Router({ mergeParams: true });

const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');


/// Login page


router.get('/login-page', viewController.loginPage);

router.get('/reset-password-page', viewController.resetPasswordPage);




/// Homepage

router.get('/', viewController.getHomePage);



//------ Static Pages	-----//


// /// Services

router.get('/static/services', viewController.getServicesPage);


// /// Portfolio

router.get('/static/about', viewController.getPortfolioPage);



/// Contact

router.get('/static/contact', viewController.getContactPage);


///			Enquiry Success Route 


router.get('/enquiry-success', viewController.getEnquirySuccess);




///			PROTECTED ROUTES			///

router.use(authController.protectRoute);



//-------------------  ---------------------- ------------------///
//-------------------  ADMIN ROUTES (BACKEND) ------------------///
//-------------------  ---------------------- ------------------///



router.use(
	authController.protectRoute,
	authController.restrictTo('admin', 'supervisor', 'owner'));



/// homepage route


router.get('/admin/be_home', viewController.adminPage);







module.exports = router;