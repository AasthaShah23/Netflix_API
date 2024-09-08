// Required Modules
const express = require('express');
const User = require('../models/userData');  // Assuming you have a User model
const crypto = require('crypto');  // You can also use jwt if needed
const nodemailer = require('nodemailer');

const router = express.Router();

// Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        // Generate a reset token and expiration time (1 hour validity)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 3600000;  // 1 hour from now

        console.log("reset token", resetToken);
        console.log("reset Token Expire", resetTokenExpire);

        // Save the token and expiration to the user's record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpire;
        await user.save();

        // Send email with the reset link
        const transporter = nodemailer.createTransport({ 
            host: "smtp.gmail.com", // true for port 465, false for other ports
            auth: {
                user: 'your-email@gmail.com',
                pass: 'app password'
            },
        });

        const resetLink = `http://yourfrontend.com/reset-password/${resetToken}`;

        console.log("user email", user.email);

        console.log("reset link for email", resetLink);

        await transporter.sendMail({
            from: 'Aastha',
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click on the link below to reset your password: ${resetLink}`,
        }).then(info => {
            console.log('Email sent: ', info.response);
        }).catch(err => {
            console.error('Error sending email:', err);
        });
        

        return res.status(200).json({ message: 'Password reset link sent to your email' });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;





// Enable "Less Secure Apps" or Use an App Password:

// Gmail has strict security rules for accessing its SMTP server. You may need to do one of the following:
// Less Secure Apps: Enable access for "Less Secure Apps" (not recommended for long-term use).
// App Password: Use an App Password if you have 2-Step Verification enabled on your account (this is the recommended way).
// For Less Secure Apps (Not Recommended): Go to your Google Account settings and turn on "Less Secure Apps" at this link: Less Secure Apps.
// For App Password (Recommended): If 2-Step Verification is enabled on your account, go to App Passwords and generate a 16-character password for "Mail". This password is used in place of your regular Gmail password when connecting to the SMTP server.