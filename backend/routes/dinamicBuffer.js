const router = require('express').Router();
const dinamicBufferController = require('../controllers/layersController');

router.get('/getBuffer', dinamicBufferController.dinamicBuffer )


module.exports = router;