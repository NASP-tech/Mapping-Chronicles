const router = require('express').Router();
const ParadasPrimarias = require('../models/ParadasPrimarias');

router.get('/', async (req, res) => {
    try {
        const paradasPrimarias = await ParadasPrimarias.find();
        res.status(200).json(paradasPrimarias);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})

module.exports = router;