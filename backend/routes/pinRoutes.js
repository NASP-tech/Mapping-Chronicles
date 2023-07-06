/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const express = require('express');
const pinController = require('../controllers/pinController');

const router = express.Router();

router.route('/').post(pinController.postPin).get(pinController.getPin);

module.exports = router;
