const express = require('express');
const router = express.Router();

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');




router.route('/signup')
	.post(authController.signupUser);


router.route('/login')
	.post(authController.loginUser);



router.get('/logout', authController.logout);



///			Password Routes			///


router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:token', authController.resetPassword);



/// Protect all routes for user only


router.use(authController.protectRoute);



router.patch('/update-my-password', authController.updateLoggedinPassword);

router.patch('/update-me', authController.updateMe);

router.delete('/delete-me', authController.deleteMe);



router.post('/createNewAddress', userController.createNewAddress);

router.patch('/updateMyAddress/:addressId', userController.updateMyAddress);

router.patch('/updateUserAddress/:addressId/:userId', userController.updateMyAddress);

router.delete('/deleteAddress/:addressId', userController.deleteAnAddress)


///	get me

router.route('/me')
	.get(
		userController.getMe,
		userController.getUser);




/// All User Functions only for admin and supervisor



router.use(authController.restrictTo('admin', 'supervisor', 'owner'));


router.route('/')
	.get(userController.getAllUser)
	.post(userController.createBeUser);;


router.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);




module.exports = router;