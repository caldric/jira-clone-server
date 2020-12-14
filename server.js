// Package dependencies
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

// Configuration
const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jira';

// Connect to MongoDB via Mongoose
mongoose.connection.on('error', (err) =>
  console.log(`${err.message} is Mongo not running?`)
);
mongoose.connection.on('disconnected', () => console.log('Mongo disconnected'));
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => console.log('Connected to Mongoose'));

// CORS configuration
const whitelist = { 'http://localhost:3000': true };
const corsOptions = {
  origin: (origin, callback) => {
    if (origin in whitelist) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Middleware
app.use(cors(corsOptions)); // CORS
app.use(express.json()); // body parser
app.use(
  session({
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Controllers
const userController = require('./controllers/user.js');

app.use('/user', userController);

// Listener
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
