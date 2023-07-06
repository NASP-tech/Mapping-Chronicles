/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // 2) Define email options
    const mailOptions = {
        from: 'Edwin Gomez <edwin@chronicles.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
