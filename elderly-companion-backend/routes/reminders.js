// routes/reminders.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import our auth middleware
const Reminder = require('../models/Reminder');

// @route   GET api/reminders
// @desc    Get all reminders for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find reminders and sort by date (newest first)
    const reminders = await Reminder.find({ user: req.user.id }).sort({ date: -1 });
    res.json(reminders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reminders
// @desc    Add a new reminder
// @access  Private
router.post('/', auth, async (req, res) => {
  const { medicineName, dosage, time } = req.body;

  try {
    const newReminder = new Reminder({
      medicineName,
      dosage,
      time,
      user: req.user.id, // Get user ID from the middleware
    });

    const reminder = await newReminder.save();
    res.json(reminder); // Send the new reminder back to the client
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });

    // Make sure user owns this reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Reminder.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Reminder removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;