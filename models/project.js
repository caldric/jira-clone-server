const mongoose = require('mongoose');

// Schema
const projectSchema = new mongoose.Schema({
  userID: { type: mongoose.ObjectId, required: true },
  name: { type: String, required: true },
  key: { type: String, required: true },
});

// Export model
module.exports = mongoose.model('Project', projectSchema);
