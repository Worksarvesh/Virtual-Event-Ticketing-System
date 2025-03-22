const axios = require('axios');
require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

// Function to get video details by ID
const getVideoDetails = async (videoId) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,contentDetails,statistics,liveStreamingDetails',
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

// Function to create a live broadcast
const createLiveBroadcast = async (accessToken, broadcastData) => {
    try {
        const response = await axios.post(
            'https://www.googleapis.com/youtube/v3/liveBroadcasts',
            {
                snippet: {
                    title: broadcastData.title,
                    description: broadcastData.description,
                    scheduledStartTime: broadcastData.startTime,
                    scheduledEndTime: broadcastData.endTime
                },
                contentDetails: {
                    boundStreamId: broadcastData.streamId,
                    enableAutoStart: true,
                    enableAutoStop: true
                },
                status: {
                    privacyStatus: 'private' // Can be changed to 'public' or 'unlisted'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating live broadcast:', error);
        throw error;
    }
};

// Function to create a live stream
const createLiveStream = async (accessToken, streamData) => {
    try {
        const response = await axios.post(
            'https://www.googleapis.com/youtube/v3/liveStreams',
            {
                snippet: {
                    title: streamData.title,
                    description: streamData.description
                },
                cdn: {
                    frameRate: 'variable',
                    resolution: 'variable',
                    ingestionType: 'rtmp'
                },
                contentDetails: {
                    isReusable: true
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating live stream:', error);
        throw error;
    }
};

// Function to get live chat messages
const getLiveChatMessages = async (liveChatId, accessToken) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/liveChat/messages`,
            {
                params: {
                    part: 'snippet,authorDetails',
                    liveChatId: liveChatId,
                    maxResults: 50
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching live chat messages:', error);
        throw error;
    }
};

// Function to insert a live chat message
const insertLiveChatMessage = async (accessToken, liveChatId, message) => {
    try {
        const response = await axios.post(
            'https://www.googleapis.com/youtube/v3/liveChat/messages',
            {
                snippet: {
                    liveChatId: liveChatId,
                    type: 'textMessageEvent',
                    textMessageDetails: {
                        messageText: message
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error inserting live chat message:', error);
        throw error;
    }
};

module.exports = {
    getVideoDetails,
    searchVideos,
    createLiveBroadcast,
    createLiveStream,
    getLiveChatMessages,
    insertLiveChatMessage
};
