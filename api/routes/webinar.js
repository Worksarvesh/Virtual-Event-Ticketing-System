const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const User = require('../models/User');
const {
    createLiveBroadcast,
    createLiveStream,
    getLiveChatMessages,
    insertLiveChatMessage
} = require('../youtubeApi');

// Create webinar
router.post('/create/:eventId', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        const event = await Event.findById(req.params.eventId);
        const user = await User.findById(userData.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.creator.toString() !== userData.id) {
            return res.status(403).json({ error: 'Not authorized to create webinar' });
        }

        // Create live stream
        const streamData = {
            title: `${event.title} - Live Stream`,
            description: event.description
        };
        const stream = await createLiveStream(user.youtubeAccessToken, streamData);

        // Create live broadcast
        const broadcastData = {
            title: event.title,
            description: event.description,
            startTime: event.eventDate.toISOString(),
            endTime: new Date(event.eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours duration
            streamId: stream.id
        };
        const broadcast = await createLiveBroadcast(user.youtubeAccessToken, broadcastData);

        // Update event with webinar details
        event.youtubeVideoId = broadcast.id;
        event.youtubeStreamId = stream.id;
        event.youtubeChatId = broadcast.snippet.liveChatId;
        await event.save();

        res.status(201).json({
            message: 'Webinar created successfully',
            broadcast,
            stream
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get webinar details
router.get('/:eventId', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (!event.youtubeVideoId) {
            return res.status(404).json({ error: 'No webinar found for this event' });
        }

        // Check if user has access (either creator or has valid ticket)
        const hasAccess = event.creator.toString() === userData.id || 
                         await Ticket.findOne({ 
                             userId: userData.id, 
                             eventId: event._id,
                             'ticketDetails.isUsed': false 
                         });

        if (!hasAccess) {
            return res.status(403).json({ error: 'Not authorized to view webinar' });
        }

        res.json({
            videoId: event.youtubeVideoId,
            chatId: event.youtubeChatId,
            streamId: event.youtubeStreamId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get webinar chat messages
router.get('/:eventId/chat', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        const event = await Event.findById(req.params.eventId);

        if (!event || !event.youtubeChatId) {
            return res.status(404).json({ error: 'Webinar chat not found' });
        }

        const messages = await getLiveChatMessages(event.youtubeChatId, userData.youtubeAccessToken);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send chat message
router.post('/:eventId/chat', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        const event = await Event.findById(req.params.eventId);

        if (!event || !event.youtubeChatId) {
            return res.status(404).json({ error: 'Webinar chat not found' });
        }

        const message = await insertLiveChatMessage(
            userData.youtubeAccessToken,
            event.youtubeChatId,
            req.body.message
        );

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 