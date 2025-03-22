const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Purchase ticket
router.post('/purchase/:eventId', async (req, res) => {
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

      if (!event.isAvailable()) {
         return res.status(400).json({ error: 'Event is not available for purchase' });
      }

      const ticketData = {
         userId: user._id,
         eventId: event._id,
         ticketDetails: {
            name: user.name,
            email: user.email,
            eventName: event.title,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            ticketPrice: event.ticketPrice
         }
      };

      const ticket = await Ticket.create(ticketData);

      // Update event statistics
      event.currentParticipants += 1;
      event.soldTickets += 1;
      event.totalRevenue += event.ticketPrice;
      await event.save();

      // Update user's purchased tickets
      user.purchasedTickets.push(ticket._id);
      await user.save();

      res.status(201).json(ticket);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get user's tickets
router.get('/my-tickets', async (req, res) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await jwt.verify(token, process.env.JWT_SECRET);
      const tickets = await Ticket.find({ userId: userData.id })
         .populate('eventId', 'title eventDate eventTime image')
         .sort({ 'ticketDetails.purchaseDate': -1 });

      res.json(tickets);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Validate ticket
router.post('/validate/:ticketCode', async (req, res) => {
   try {
      const ticket = await Ticket.findOne({ 'ticketDetails.ticketCode': req.params.ticketCode });
      
      if (!ticket) {
         return res.status(404).json({ error: 'Ticket not found' });
      }

      if (!ticket.validateTicket()) {
         return res.status(400).json({ error: 'Invalid or used ticket' });
      }

      res.json({ valid: true, ticket });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Use ticket
router.post('/use/:ticketCode', async (req, res) => {
   try {
      const ticket = await Ticket.findOne({ 'ticketDetails.ticketCode': req.params.ticketCode });
      
      if (!ticket) {
         return res.status(404).json({ error: 'Ticket not found' });
      }

      if (!ticket.useTicket()) {
         return res.status(400).json({ error: 'Ticket cannot be used' });
      }

      await ticket.save();
      res.json({ message: 'Ticket used successfully', ticket });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get event tickets (for creators)
router.get('/event/:eventId', async (req, res) => {
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

      if (event.creator.toString() !== userData.id) {
         return res.status(403).json({ error: 'Not authorized to view these tickets' });
      }

      const tickets = await Ticket.find({ eventId: req.params.eventId })
         .populate('userId', 'name email')
         .sort({ 'ticketDetails.purchaseDate': -1 });

      res.json(tickets);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router; 