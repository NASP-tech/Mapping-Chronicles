const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} is ${err.value}`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// to be used for duplicate user emails
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `${value} already exists`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleJWExpiredError = () => new AppError('Token has expired. please log in again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // if the error is operational (no internet conection for example), display it to the user on production
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // if error is a programming error or other unknown error, do not let the user know the details
    } else {
        console.log(err); // log the error for debugging
        res.status(500).json({
            status: 'error',
            message: 'something went wrong',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err); // create a hard copy of the original error object to avoid its mutation. {...err} destructuring was not working properly, switched to Object.assign

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error); // handle mongoose's validations errors so a more user frendly message is shown
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWExpiredError();
        sendErrorProd(error, res);
    }
};
