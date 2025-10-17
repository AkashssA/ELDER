// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  const { name, email, password, role, primaryUserEmail } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. If registering as a family member, verify primary user
    let primaryUserId = null;
    if (role === 'family') {
      if (!primaryUserEmail) {
        return res
          .status(400)
          .json({ msg: "Primary user's email is required for family accounts." });
      }

      const primaryAccount = await User.findOne({ email: primaryUserEmail });
      if (!primaryAccount) {
        return res
          .status(404)
          .json({ msg: 'The specified elderly user account was not found.' });
      }

      primaryUserId = primaryAccount.id;
    }

    // 3. Create a new user instance with role and optional primaryUser link
    user = new User({
      name,
      email,
      password,
      role,
      primaryUser: primaryUserId, // null if elderly
    });

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Save user
    await user.save();

    // 6. Create and return a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        primaryUser: user.primaryUser,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create and return a JWT token with role + primaryUser
    const payload = {
      user: {
        id: user.id,
        role: user.role,          // <-- role added
        primaryUser: user.primaryUser, // <-- primaryUser link added
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
