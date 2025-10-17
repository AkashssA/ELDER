// backend/routes/photos.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../config/cloudinary'); // Our upload middleware
const Photo = require('../models/Photo');

// @route   POST api/photos
// @desc    Upload a new photo
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const newPhoto = new Photo({
      user: req.user.id,
      imageUrl: req.file.path,
      publicId: req.file.filename,
      caption: req.body.caption
    });
    const photo = await newPhoto.save();
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photos
// @desc    Get all photos for the user
router.get('/', auth, async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;