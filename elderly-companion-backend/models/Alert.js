// models/Alert.js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  userName: { // Store the name for easy viewing in logs
    type: String,
  },
  userEmail: { // Store the email as well
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    default: 'SOS button pressed by user.',
  },
});

module.exports = mongoose.model('alert', AlertSchema);