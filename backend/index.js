/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors');

const app = express();
const pinRoute = require("./routes/pinRoutes");
const userRoute = require("./routes/userRoutes");
const layerRoute = require("./routes/layers");
dotenv.config();

app.use(express.json());

app.use(cors());

mongoose.connect('mongodb://localhost:27017/chronicles',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => { console.log(err) });

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);
app.use("/api/layers", layerRoute);
app.listen(5000, () => {
    console.log("Server is running on port 5000 :)");

})