const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// only makes sense to post data on signup, that's why it has not been chained in the REST format below
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

module.exports = router;
