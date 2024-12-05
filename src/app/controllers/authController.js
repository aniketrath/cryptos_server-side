const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Registration Logic
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Logic
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Username. Please Retry 😊' });
    }
    // Compare the entered password with the hashed password in the DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Passwd. Please Retry 💀' });
    }
    // Create a JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: null });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout Logic
const logout = (req, res) => {
  try {
    // In this case, we don't need to explicitly destroy the token,
    // it's just stored client-side, so you could either clear it client-side
    // or simply send a success message
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, logout };
