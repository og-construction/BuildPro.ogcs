const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
require('dotenv').config();


const sendEmail = asyncHandler(async (data) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.OGCS,
                pass: process.env.OGCS_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"hey" <${process.env.EMAIL_USER}>`, // Fixed template string here
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error('Email sending failed');
    }
});


module.exports = sendEmail;
