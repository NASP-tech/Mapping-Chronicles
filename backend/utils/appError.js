/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
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
