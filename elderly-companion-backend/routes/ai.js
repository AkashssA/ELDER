// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Conversation = require('../models/Conversation'); // <-- IMPORT THE NEW MODEL

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id; // Get user ID from auth middleware

  if (!message) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chatPrompt = `You are a kind, patient, and empathetic AI companion... User: ${message}`;
    const result = await model.generateContent(chatPrompt);
    const response = await result.response;
    const botReply = response.text();

    // --- NEW DATABASE LOGIC STARTS HERE ---
    const userMessage = { sender: 'user', text: message };
    const botMessage = { sender: 'bot', text: botReply };

    // Find the user's conversation and add the new messages
    await Conversation.findOneAndUpdate(
      { user: userId },
      { $push: { messages: { $each: [userMessage, botMessage] } } },
      { upsert: true, new: true } // 'upsert: true' creates a new document if one doesn't exist
    );
    // --- NEW DATABASE LOGIC ENDS HERE ---

    res.json({ reply: botReply });

  } catch (err) {
    console.error('Gemini API or DB Error:', err);
    res.status(500).json({ reply: 'Sorry, my AI brain is taking a nap. Please try again in a moment.' });
  }
});

module.exports = router;