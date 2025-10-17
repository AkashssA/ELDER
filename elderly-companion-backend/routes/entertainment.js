// backend/routes/entertainment.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route   GET api/entertainment/search
// @desc    Search for YouTube videos
// @access  Private
router.get('/search', auth, async (req, res) => {
  const { query } = req.query; // Get the search term from a query parameter like ?query=lata mangeshkar

  if (!query) {
    return res.status(400).json({ msg: 'Search query is required' });
  }

  const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q: query,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 10, // Get up to 10 results
        type: 'video',
      },
    });

    // Map the complex YouTube response to a simple array we can use on the frontend
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    res.json(videos);
  } catch (err) {
    console.error('YouTube API Error:', err.response ? err.response.data : err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;