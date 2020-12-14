// Package dependencies
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/user.js');

// Router configuration
const router = express.Router();

// Routers
router.post('/register', async (req, res) => {
  // Destructure the body
  const { email, password } = req.body;

  // Validation: all fields must be present
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validation: password must be a minimum of 8 characters
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: 'The password needs to be at least 8 characters long' });
  }

  // Validation: check if user has alredy created account
  const existingUser = await User.findOne({ email }).catch((err) =>
    res.status(400).json({ error: err.message })
  );

  if (existingUser) {
    return res
      .status(400)
      .json({ error: 'An account with this email already exists' });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync()
  );

  // Create new user in the database
  const newUser = await User.create({
    email,
    password: hashedPassword,
  }).catch((err) => res.status(400).json({ error: err.message }));

  // Return newly created user information if everything is successful
  return res.status(200).json(newUser);
});

// Export
module.exports = router;
