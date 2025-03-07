const axios = require('axios');
require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Ensure to set this in your .env file

// Function to get video details by ID
const getVideoDetails = async (videoId) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: YOUTUBE_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching video details:', error);
        throw error;
    }
};

// Function to search for videos
const searchVideos = async (query) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                key: YOUTUBE_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching videos:', error);
        throw error;
    }
};

module.exports = {
    getVideoDetails,
    searchVideos
};
