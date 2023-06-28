const router = require('express').Router();
const BufferEntradasUCA = require('../models/BufferEntradasUCA');

router.get('/', async (req, res) => {
    try {
        const bufferEntradasUCA = await BufferEntradasUCA.find();
        res.status(200).json(bufferEntradasUCA);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})

module.exports = router;