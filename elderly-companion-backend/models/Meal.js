// backend/models/Meal.js
const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // We will store the date without time to easily query for a specific day
  date: {
    type: String, // Storing as "YYYY-MM-DD"
    required: true,
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('meal', MealSchema);