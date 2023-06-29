const router = require('express').Router();
const layersController = require('../controllers/layersController');

router.get('/getMyBuffer', layersController.dinamicBuffer )
router.get('/getBusStopsByRadius', layersController.getBusStopsByRadius )
router.get('/getNearestBusStop', layersController.getNearestBusStop)
router.get('/getEntradasUCA', layersController.getEntradasUCA)
router.get('/getParadasPrimarias', layersController.getParadasPrimarias)
router.get('/getRutasPrimarias', layersController.getRutasPrimarias)
router.get('/getBufferEntradasUCA', layersController.getBufferEntradasUCA)
module.exports = router;