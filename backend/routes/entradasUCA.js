const router = require('express').Router();
const EntradasUCA = require('../models/EntradasUCA');

router.get('/', async (req, res) => {
    try {
        const entradasUCA = await EntradasUCA.find();
        res.status(200).json(entradasUCA);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})


module.exports = router;

