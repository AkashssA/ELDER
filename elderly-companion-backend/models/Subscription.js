// backend/models/Subscription.js
const mongoose = require('mongoose');
const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
});
module.exports = mongoose.model('subscription', SubscriptionSchema);