const axios = require('axios');
require('dotenv').config();

const YOUTUBE_ANALYTICS_API_KEY = process.env.YOUTUBE_ANALYTICS_API_KEY; // Ensure to set this in your .env file

// Function to get channel analytics
const getChannelAnalytics = async (channelId, accessToken) => {
    try {
        const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            params: {
                ids: `channel==${channelId}`,
                metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments',
                key: YOUTUBE_ANALYTICS_API_KEY
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching channel analytics:', error);
        throw error;
    }
};

// Function to get video analytics
const getVideoAnalytics = async (videoId, accessToken) => {
    try {
        const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            params: {
                ids: `video==${videoId}`,
                metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments',
                key: YOUTUBE_ANALYTICS_API_KEY
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching video analytics:', error);
        throw error;
    }
};

// Function to get viewer demographics
const getViewerDemographics = async (videoId, accessToken) => {
    try {
        const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            params: {
                ids: `video==${videoId}`,
                metrics: 'viewerPercentage',
                dimensions: 'ageGroup,gender',
                key: YOUTUBE_ANALYTICS_API_KEY
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching viewer demographics:', error);
        throw error;
    }
};

// Function to get traffic sources
const getTrafficSources = async (videoId, accessToken) => {
    try {
        const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            params: {
                ids: `video==${videoId}`,
                metrics: 'views',
                dimensions: 'insightTrafficSourceType',
                key: YOUTUBE_ANALYTICS_API_KEY
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching traffic sources:', error);
        throw error;
    }
};

// Function to get engagement metrics
const getEngagementMetrics = async (videoId, accessToken) => {
    try {
        const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            params: {
                ids: `video==${videoId}`,
                metrics: 'averageViewDuration,estimatedMinutesWatched,views,likes,comments',
                key: YOUTUBE_ANALYTICS_API_KEY
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching engagement metrics:', error);
        throw error;
    }
};

module.exports = {
    getChannelAnalytics,
    getVideoAnalytics,
    getViewerDemographics,
    getTrafficSources,
    getEngagementMetrics
};
