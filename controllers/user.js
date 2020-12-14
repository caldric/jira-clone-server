// Package dependencies
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/user.js');

// Router configuration
const userRouter = express.Router();

// Routers
userRouter.post('/signup', async (req, res) => {
  // Hash password
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());

  const newUser = await User.create(req.body).catch((err) =>
    res.status(400).json({ error: err.message })
  );
  res.status(200).json(newUser);
});

// Export
module.exports = userRouter;
