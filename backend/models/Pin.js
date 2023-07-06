/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        min: 3,
    },
    desc: {
        type: String,
        required: true,
        min: 3,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model("Pin", PinSchema);
