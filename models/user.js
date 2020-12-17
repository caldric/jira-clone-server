const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export model
module.exports = mongoose.model('User', userSchema);
