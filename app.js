/* express configuration */
const express = require('express');
const morgan = require('morgan'); // middleware
const path = require('path');
//const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
//const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();

// set template engines
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
    res.status(200).render('base');
});

// handle unhandled endpoints
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

// prevent from xss
app.use(xss());

module.exports = app;
