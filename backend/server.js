/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const mongoose = require('mongoose'); // note that mongoose@5 is used
const dotenv = require('dotenv');

// handle uncaught exceptions
process.on('uncaughtException', (err) => { // i.e database connection errors
    console.log(err.name, err.message);
    console.log('uncaughtException, shutting down');
    process.exit(1);
});

dotenv.config({ path: './config.env' }); // use my defined enviroment variables. needs to be prior invoking the app  file so it can be loaded correctly
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); // replace the password into the connection string
//const DB = process.env.DATABASE_LOCAL;
console.log(DB);

// database connection
mongoose.connect(DB, {
    // options to deal with some deprecation warnings
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    //useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection made successfully');
});

/* start server's listener */
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', (err) => { // i.e database connection errors
    console.log(err.name, err.message);

    // give the server time to handle the pending requests before it shut downs gracefully
    server.close(() => {
        process.exit(1);
    });
});
