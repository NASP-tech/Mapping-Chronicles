/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// only makes sense to post data on signup, that's why it has not been chained in the REST format below
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
