// models/Reminder.js
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This links it to our User model
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
  },
  time: {
    type: String, // We'll store time as a string (e.g., "09:00 AM") for simplicity
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('reminder', ReminderSchema);