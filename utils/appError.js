class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // call parent constructor

        this.statusCode = statusCode;
        //operational errors, not programming errors
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor); // to preserve the stack trace for the error information retrieval
    }
}

module.exports = AppError;
