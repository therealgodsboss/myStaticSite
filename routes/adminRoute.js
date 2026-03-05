const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController.js');



//------  Global admin protection -----//

router.use(authController.protectRoute);

router.use(authController.restrictTo('admin', 'owner', 'supervisor'));



module.exports = router;