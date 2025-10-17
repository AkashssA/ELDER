// backend/models/Conversation.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'], // Sender can only be 'user' or 'bot'
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Link to the user who owns this chat
    ref: 'user',
    required: true,
    unique: true, // Each user has only one conversation history
  },
  messages: [MessageSchema], // An array of messages using the schema above
});

module.exports = mongoose.model('conversation', ConversationSchema);