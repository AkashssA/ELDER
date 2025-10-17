// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // --- NEW FIELDS ---
  role: {
    type: String,
    enum: ['elderly', 'family'], // Role can only be one of these
    default: 'elderly',
  },
  // If role is 'family', this links to the elderly person they care for
  primaryUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  // --- END NEW FIELDS ---

  familyContactNumber: { type: String },
  videoCallLink: { type: String, default: 'https://meet.google.com' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);