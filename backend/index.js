const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors');

const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

dotenv.config();

app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGO_URL,
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

app.listen(5000, () => {
    console.log("Server is running on port 5000 :)");

})