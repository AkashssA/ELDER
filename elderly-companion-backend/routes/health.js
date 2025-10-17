// backend/routes/health.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthMetric = require('../models/HealthMetric');

// @route   POST api/health
// @desc    Add a new health metric reading
router.post('/', auth, async (req, res) => {
  const { metricType, value1, value2, date } = req.body;
  try {
    const newMetric = new HealthMetric({
      user: req.user.id,
      metricType,
      value1,
      value2,
      date: date || new Date(),
    });
    const metric = await newMetric.save();
    res.json(metric);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/health/:metricType
// @desc    Get all readings for a specific metric
router.get('/:metricType', auth, async (req, res) => {
  try {
    const metrics = await HealthMetric.find({
      user: req.user.id,
      metricType: req.params.metricType,
    }).sort({ date: 1 }); // Sort by date ascending
    res.json(metrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;