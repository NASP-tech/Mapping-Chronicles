const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // convert to milliseconds
        //secure: true, // https
        //httpOnly: true, // do not allow browser to access cookie to try to prevent xss <-- currently not working so I will disable it for now
    });

    user.password = undefined; // remove passwords from output when generating user related stuff

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    // create jwt to log in the user right after singing up. JWT_SECRET is used to sign the new user's id
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password'); // +password so I can select the password field which I've been defined as unselectable by default
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) if ok, send token to client
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // format is Bearer <token>, therefore need [1] for <token> value
    }
    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access', 401));
    }
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // will decode user ID

    // 3) check if user that made the request still exists
    const currentUser = await User.findById(decoded.id); // this is why I decode the id from the token, so I can now query by userId and make sure that the token belongs to the requesting user
    if (!currentUser) {
        return next(new AppError('User no longer exists', 401));
    }

    // 4) check if user changed passwor after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Log in again', 401));
    }

    req.user = currentUser; // send current user's info into the middlware
    next(); // grant access to protected route... go to 'next' middlware
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) { // the role is comming in the middleware from the above function protect(), which in the routes is placed before the restricTo
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
};
