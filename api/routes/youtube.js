const express = require('express');
const { getVideoDetails, searchVideos } = require('../youtubeApi');
const router = express.Router();

// Route to get video details
router.get('/video/:id', async (req, res) => {
    const videoId = req.params.id;
    try {
        const videoDetails = await getVideoDetails(videoId);
        res.json(videoDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video details' });
    }
});

// Route to search for videos
router.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const searchResults = await searchVideos(query);
        res.json(searchResults);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search videos' });
    }
});

module.exports = router;
