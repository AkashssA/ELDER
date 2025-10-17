// backend/models/Photo.js
const mongoose = require('mongoose');
const PhotoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true }, // From Cloudinary, for deleting
  caption: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('photo', PhotoSchema);