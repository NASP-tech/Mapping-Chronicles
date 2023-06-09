const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

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

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        // each field is specified individually to avoid a user to specify unwanted params, like asigning himself/herself an 'admin' role
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        // TODO: gotta implement the selection of 'nutritionist'
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

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'nutritionist', 'user']
        if (!roles.includes(req.user.role)) { // the role is comming in the middleware from the above function protect(), which in the routes is placed before the restricTo
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // so user does not have to provide the password field defined as mandatory on the model

    // send resettoken to user... TODO: check how to alias the resetURL for a better data presentation on the email
    const resetURL = `${req.protocol}:://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Submit a patch request with your new password and password confirm to ${resetURL}. Otherwise, please ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        // if the email cannot be sent, reset the passwordResetToken and the passwordResetExpires prroperties
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false }); // so user does not have to provide the password field defined as mandatory on the model

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // below is checked if the passwordResetExpires is greater than right now because that would mean the token has not yet expired so it's still valid.
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // 2) update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // validators are not turn off here because I do wan't to validate that the password and passwordConfirm are the same

    // 3) log the user in, send JWT
    createSendToken(user, 200, res);
});

// functionality for logged in users only
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // 3) if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save(); // note: updating methods such as findByIdAndUpdate cannot be used because the hooks I've implemented work on 'save' and 'create',  that is why I use user.save() instead of User.findByIdAndUpdate()

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});
