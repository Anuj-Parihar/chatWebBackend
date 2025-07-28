const User = require('../models/User');
const config = require('../config/config');
const { createToken } = require('../utils/auth');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      password,
      isGuest: false
    });

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + config.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        isGuest: user.isGuest,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + config.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        isGuest: user.isGuest,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create guest user
exports.guestLogin = async (req, res, next) => {
  try {
    // Generate random username
    const username = `Guest_${Math.floor(Math.random() * 10000)}`;
    
    // Create guest user
    const user = await User.create({
      username,
      password: 'guest_password', // Not used for login
      isGuest: true
    });

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + config.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        isGuest: user.isGuest,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};