/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const router = require("express").Router();
const Pin = require("../models/Pin");

// create a pin
router.post("/", async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);

    } catch (err) {
        res.status(500).json(err);
    }
});

// get all pins

router.get("/", async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;