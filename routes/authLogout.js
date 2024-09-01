const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/userData'); // Your User model

let loggedOutUsers = {}; // In-memory store for logged-out users

// Basic authentication middleware
const basicAuth = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header is missing' });
//   }

const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Basic ')) {
  return res.status(400).json({ message: 'Authorization header missing or invalid' });
}

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    // Fetch the user from the database
    const user = await User.findOne({ email });
    console.log("User found for email 28:", user);
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: 'user is not yet registered' });
    }

    // Check if the user has already logged out
    if (loggedOutUsers[email]) {
      return res.status(400).json({ message: 'User already logged out' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("is password correct in logout..", isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Password is invalid' });
    }


    if (user.loggedOut) {
      return res.status(400).json({ message: 'User already logged out' });
    }

    req.user = {user}; // Attach user info to the request object
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server sahdjah error', error: error.message });
  }
};

// Logout route
router.post('/logout', basicAuth, async (req, res) => {
  const { user } = req.user;

  console.log("user details", user);

  try {
    // Mark the user as logged out
    console.log("user before logout..", user.loggedOut);
    user.loggedOut = true;
    await user.save();
    console.log("user after logout..", user.loggedOut);

    return res.status(200).json({
      message: 'Logout successful. Please clear your saved credentials.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  
});

module.exports = router;
