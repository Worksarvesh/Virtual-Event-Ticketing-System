const axios = require('axios');
require('dotenv').config();

const YOUTUBE_ANALYTICS_API_KEY = process.env.YOUTUBE_ANALYTICS_API_KEY; // Ensure to set this in your .env file

// Function to get channel analytics
const getChannelAnalytics = async (channelId) => {
    try {
        const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            params: {
                ids: `channel==${channelId}`,
                metrics: 'views,likes,subscribersGained',
                key: YOUTUBE_ANALYTICS_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching channel analytics:', error);
        throw error;
    }
};

module.exports = {
    getChannelAnalytics
};
