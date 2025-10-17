// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Subscription = require('../models/Subscription');

// @route   POST api/notifications/subscribe
// @desc    Save a user's push notification subscription
router.post('/subscribe', auth, async (req, res) => {
  const subscription = req.body;
  try {
    // Save or update the subscription for the user
    await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { ...subscription, user: req.user.id },
      { upsert: true }
    );
    res.status(201).json({ msg: 'Subscription saved.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;