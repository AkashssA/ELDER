// backend/routes/alerts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const User = require('../models/User'); 
const twilio = require('twilio'); // <-- Import Twilio

// @route   POST api/alerts/trigger
// @desc    Trigger and send an emergency alert
// @access  Private
router.post('/trigger', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 1. Log the alert to our database (as before)
    const newAlert = new Alert({
      user: user.id,
      userName: user.name,
      userEmail: user.email,
    });
    await newAlert.save();

    // 2. Check if the user has a family contact number set
    if (!user.familyContactNumber) {
      console.log(`User ${user.name} triggered an SOS but has no contact number.`);
      return res.json({ msg: 'Alert logged, but no contact number is set up.' });
    }

    // 3. Send the SMS using Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
       body: `Emergency Alert from Elderly Companion: ${user.name} has pressed their SOS button. Please contact them immediately.`,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: user.familyContactNumber // Send to the number in the user's profile
    });

    res.json({ msg: 'Emergency alert successfully triggered and notification sent!' });

  } catch (err) {
    console.error("Twilio or DB Error:", err.message);
    res.status(500).send('Server Error');
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user.familyContactNumber) {
      return res.status(400).json({ msg: 'No family contact number set up.' });
    }
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
       body: `A quick message from Elderly Companion: ${user.name} is thinking of you! ❤️`,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: user.familyContactNumber
    });
    res.json({ msg: 'Love sent!' });
  } catch (err) {
    console.error("Send Love Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;