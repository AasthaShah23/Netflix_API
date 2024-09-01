const express = require('express');
const router = express.Router();
const User = require('../models/userData');
const validator = require('validator');

// Validation function for the password
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

router.post('/signin', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Check if all fields are provided
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate email using validator
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Sanitize the email (lowercase, trim spaces)
  const sanitizedEmail = validator.normalizeEmail(email);
  console.log("sanitizedEmail", sanitizedEmail );

  // Validate firstname and lastname (optional: check if they contain only letters)
  if (!validator.isAlpha(firstname) || !validator.isAlpha(lastname)) {
    return res.status(400).json({ message: 'First name and last name should contain only letters' });
  }

  // Validate password using custom regex
  if (!isValidPassword(password)) {
    return res.status(400).json({ 
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.' 
    });
  }

  try {
    // Check if the user already exists using sanitized email
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Create new user with sanitized email
    const user = new User({ firstname, lastname, email: sanitizedEmail, password });
    await user.save();

    res.status(201).json({ message: 'User signed in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
