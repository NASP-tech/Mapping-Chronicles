const router = require('express').Router();
const layersController = require('../controllers/layersController');

router.get('/getMyBuffer', layersController.dinamicBuffer )
router.get('/getBusStopsByRadius', layersController.getBusStopsByRadius )
router.get('/getNearestBusStop', layersController.getNearestBusStop)
module.exports = router;