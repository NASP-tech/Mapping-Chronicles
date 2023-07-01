const Pin = require('../models/Pin');
const catchAsync = require('../utils/catchAsync');

// create a pin
exports.postPin = catchAsync(async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get all pins

exports.getPin = catchAsync(async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (err) {
        res.status(500).json(err);
    }
});
