const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name must be provided'],
    },
    email: {
        type: String,
        required: [true, 'email must be provided'],
        unique: true,
        lowercase: true, // transform email to lowercase
        validate: [validator.isEmail, 'provide a valid email'],
    },
    photo: {
        type: String,
        default: 'user-default-photo.jpg',
    },
    password: {
        type: String,
        required: [true, 'password must be provided'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [false, 'password must be confirmed'],
        // custom validator. NOTE: Only works on create and on save
        validate: {
            validator: function(el) {
                return el === this.password; // validate if it's the same password.
            },
            message: 'Passwords are not the same',
        },
        select: false,
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['driver', 'student'],
        default: 'student',
    },
    passwordChangedAt: Date, // to be used when verifying if the user's password has not been changed after the user's token was generated
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// encrypt password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); //only encrypt password when user changes it or creates a new one on singup, not when other data is updated like the email i.e

    this.password = await bcrypt.hash(this.password, 12); // the higher the value (12), the better the encryption, more cpu load is needed tho
    this.passwordConfirm = undefined; // passwordConfirm is no longer needed once it has been initially confirmed at change/signup.
    next();
});

// update the passwordChangedAt property
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000; // substract one second from the real time because sometimes saving to the db can be slower, so if it takes 1 second more than the value at Date.now, the token will seem like it was issued prior changing the password, which would render it invalid
    next();
});

// filter out inactive users with query middleware
userSchema.pre(/^find/, function(next) {
    this.find({ active: true });
    next();
});

// instance method which will be available on all documents of the collection
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // divide and parse the retrieved time for it to be the same base as of the iat provided by the decoded jwt
        return JWTTimestamp < changedTimestamp; // i.e 100 < 200
    }
    // False means that the password has not been changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes converted to seconds and then to miliseconds since that's how it's handled by express

    console.log({ resetToken }, this.passwordResetToken);

    return resetToken; // via email is sent the unencrypted token so it can be compared with the encrypted resetToken that will be stored in the DB
};

const User = mongoose.model('User', userSchema);

module.exports = User;
