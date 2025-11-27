const mongoose = require('mongoose');

const DayPlanSchema = new mongoose.Schema(
  {
    breakfast: { type: String, default: '' },
    lunch: { type: String, default: '' },
    snack: { type: String, default: '' },
    dinner: { type: String, default: '' },
    calories: { type: Number, default: null },
  },
  { _id: false },
);

const PrescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  weekStart: {
    type: String,
    required: true,
  },
  plan: {
    type: Object,
    default: {},
  },
  fileName: {
    type: String,
  },
  filePath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('prescription', PrescriptionSchema);

