// backend/models/HealthMetric.js
const mongoose = require('mongoose');

const HealthMetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  metricType: {
    type: String,
    required: true,
    enum: ['bloodPressure', 'bloodSugar', 'weight', 'heartRate'],
  },
  // For BP, value1 is Systolic. For others, it's the main value.
  value1: {
    type: Number,
    required: true,
  },
  // For BP, value2 is Diastolic. Not required for others.
  value2: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('healthMetric', HealthMetricSchema);