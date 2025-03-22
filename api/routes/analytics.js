const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const User = require('../models/User');
const {
    getChannelAnalytics,
    getVideoAnalytics,
    getViewerDemographics,
    getTrafficSources,
    getEngagementMetrics
} = require('../youtubeAnalytics');

// Get event analytics
router.get('/event/:eventId', async (req, res) => {
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
            return res.status(403).json({ error: 'Not authorized to view analytics' });
        }

        if (!event.youtubeVideoId) {
            return res.status(404).json({ error: 'No webinar found for this event' });
        }

        // Get all analytics data
        const [
            videoAnalytics,
            demographics,
            trafficSources,
            engagementMetrics
        ] = await Promise.all([
            getVideoAnalytics(event.youtubeVideoId, user.youtubeAccessToken),
            getViewerDemographics(event.youtubeVideoId, user.youtubeAccessToken),
            getTrafficSources(event.youtubeVideoId, user.youtubeAccessToken),
            getEngagementMetrics(event.youtubeVideoId, user.youtubeAccessToken)
        ]);

        // Combine ticket sales data
        const ticketAnalytics = {
            totalTickets: event.availableTickets,
            soldTickets: event.soldTickets,
            totalRevenue: event.totalRevenue,
            averageTicketPrice: event.ticketPrice
        };

        res.json({
            videoAnalytics,
            demographics,
            trafficSources,
            engagementMetrics,
            ticketAnalytics
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get creator's overall analytics
router.get('/creator', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userData.id);

        if (user.role !== 'creator') {
            return res.status(403).json({ error: 'Not authorized to view creator analytics' });
        }

        // Get channel analytics
        const channelAnalytics = await getChannelAnalytics(user.youtubeChannelId, user.youtubeAccessToken);

        // Get all events created by the user
        const events = await Event.find({ creator: user._id });

        // Calculate overall event statistics
        const eventStats = {
            totalEvents: events.length,
            totalRevenue: events.reduce((sum, event) => sum + event.totalRevenue, 0),
            totalTicketsSold: events.reduce((sum, event) => sum + event.soldTickets, 0),
            averageAttendance: events.reduce((sum, event) => sum + event.currentParticipants, 0) / events.length || 0
        };

        res.json({
            channelAnalytics,
            eventStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 