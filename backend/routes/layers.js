/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
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