const express = require('express');
const { getChannelAnalytics } = require('../youtubeAnalytics');
const router = express.Router();

// Route to get channel analytics
router.get('/channel/:id', async (req, res) => {
    const channelId = req.params.id;
    try {
        const analyticsData = await getChannelAnalytics(channelId);
        res.json(analyticsData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch channel analytics' });
    }
});

module.exports = router;
