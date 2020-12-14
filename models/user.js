const mongoose = require('mongoose');
const userRouter = require('../controllers/user');

// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export model
module.exports = mongoose.model('User', userSchema);
