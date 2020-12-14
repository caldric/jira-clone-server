// Package dependencies
const _ = require('lodash');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

router.post('/login', async (req, res) => {
  // Destructure the body
  const { email, password } = req.body;

  // Validation: all fields must be present
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validation: check if user credentials match the database
  const user = await User.findOne({ email }).catch((err) =>
    res.status(400).json({ error: err.message })
  );
  const validCredentials = user
    ? bcrypt.compareSync(password, user.password)
    : false;

  if (!validCredentials) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Return token and user information if everything is successful
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return res.status(200).json({ token, user: _.pick(user, ['_id', 'email']) });
});

router.delete('/delete', auth, async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.user).catch((err) =>
    res.status(500).json({ error: err.message })
  );
  return res.status(200).json(_.pick(deletedUser, ['_id', 'email']));
});

// Export
module.exports = router;
