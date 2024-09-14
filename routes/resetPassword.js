const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');  // To hash the new password
const User = require('../models/userData');  // Assuming you have a User model
const moment = require('moment-timezone');

const router = express.Router();

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log("token", token);

    try {
        // 1. Find the user by the reset token and ensure it hasn’t expired
        const user = await User.findOne({
            resetPasswordToken: token,
            // resetPasswordExpire: { $gt: Date.now() },  // Check if token is still valid
            
        });

        console.log("user", user);
        const resetPasswordExpire = moment(User.resetPasswordExpire).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

        console.log('IST Time:',resetPasswordExpire);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // 2. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update the user's password and clear the reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();  // Save the updated user with the new password

        return res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
