const router = require('express').Router();
const RutasPrimarias = require('../models/RutasPrimarias');

router.get('/', async (req, res) => {
    try {
        const rutasPrimarias = await RutasPrimarias.find();
        res.status(200).json(rutasPrimarias);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})

module.exports = router;