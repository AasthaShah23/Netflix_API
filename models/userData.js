const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: [validator.isEmail, 'Invalid email'] 
  },
  password: { 
    type: String, 
    required: true 
  },
  loggedOut: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
