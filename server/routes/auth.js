const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ── POST /api/auth/register ────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, role, city, institution, interests, skills } = req.body;

  // Basic field validation
  if (!name || !email || !password || !role || !city || !institution) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash password with bcrypt (salt rounds = 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      city, 
      institution,
      interests: interests || [],
      skills: skills || []
    });
    await newUser.save();

    console.log(`📝 New user registered: ${email} (${role})`);
    res.status(201).json({ message: 'Registration successful! You can now sign in.' });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ───────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Sign JWT using env secret — never hardcode!
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`🔑 Login success for: ${email} — token issued`);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;