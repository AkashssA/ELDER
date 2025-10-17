// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');

// @route   GET api/chat/history
// @desc    Get the chat history for the logged-in user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ user: req.user.id });

    if (!conversation) {
      return res.json([]); // No history, return an empty array
    }

    res.json(conversation.messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;