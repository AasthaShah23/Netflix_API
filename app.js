require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const authSignIn = require('./routes/authSignIn');
const authLogin = require('./routes/authLogin');
const authLogout = require('./routes/authLogout');
const authDelete = require('./routes/authDelete');
const forgotpassword = require('./routes/forgotPassword');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api', authSignIn);
app.use('/api', authLogin);
app.use('/api', authLogout);
app.use('/api', authDelete);
app.use('/api', forgotpassword);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
