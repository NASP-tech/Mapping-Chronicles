const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors');

const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const entradasUCARoute = require("./routes/entradasUCA");
const bufferEntradasUCARoute = require("./routes/bufferEntradasUCA");
const rutasPrimariasRoute = require("./routes/rutasPrimarias");
const paradasPrimariasRoute = require("./routes/paradasPrimarias");
const dinamicBufferRoute = require("./routes/dinamicBuffer");
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