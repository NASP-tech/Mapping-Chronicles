const express = require('express');
const pinController = require('../controllers/pinController');

const router = express.Router();

router.route('/').post(pinController.postPin).get(pinController.getPin);

module.exports = router;
