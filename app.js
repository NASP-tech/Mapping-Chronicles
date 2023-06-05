/* express configuration */
const express = require('express');
const morgan = require('morgan'); // middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// custom error handler
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

app.use(helmet()); // set security HTTP headers

/* middleware */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // also logs to console besides being a middleware
}

app.use(express.json());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(express.static(`${__dirname}/public`)); // public serves a root directory so 'public' is not needed on the urls

// mount routes here



// handle unhandled endpoints
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

// prevent from xss
app.use(xss());

module.exports = app;
