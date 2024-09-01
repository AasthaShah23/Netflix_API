const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userData');
const validator = require('validator');

// Validation function for the password
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate email using validator
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Sanitize the email (lowercase, trim spaces)
  const sanitizedEmail = validator.normalizeEmail(email);
  console.log("sanitizedEmail" );

  // Validate password using custom regex
  if (!isValidPassword(password)) {
    return res.status(400).json({ 
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.' 
    });
  }

  try {
    // Check if the user already exists using sanitized email
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not registered' });
    }
    

const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    console.log("Password correct or not:", isPasswordCorrect); // Log password comparison result

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    existingUser.loggedOut = false;
    await existingUser.save();

    res.status(200).json({
        message: 'Login successful'
      });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;


