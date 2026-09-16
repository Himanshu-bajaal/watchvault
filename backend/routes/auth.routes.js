const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10); // random data mixed into the password so identical passwords don't hash the same
    const hashedPassword = await bcrypt.hash(password, salt); // one-way hash — cannot be reversed back to the plain password

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Account created successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }, // never send the password back, even hashed
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password'); // schema hides password by default — opt in here
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' }); // vague on purpose — don't reveal which field was wrong
    }

    const isMatch = await bcrypt.compare(password, user.password); // re-hashes input with the same salt and compares
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // signing key — proves this token genuinely came from our server
      { expiresIn: '7d' },
    );

    res.cookie('token', token, {
      httpOnly: true, // blocks frontend JS from reading this cookie — protects against XSS token theft
      secure: false,  // set to true once deployed over HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in milliseconds
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Checks whether the request's cookie belongs to a still-valid session — used on app load to restore login state
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token'); // deletes the cookie in the browser — frontend JS can't do this itself since it's httpOnly
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;