const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer configuration for image upload
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
   }
});

const upload = multer({ 
   storage,
   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create new event
router.post('/create', upload.single('image'), async (req, res) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userData.id);
      
      if (user.role !== 'creator') {
         return res.status(403).json({ error: 'Only creators can create events' });
      }

      const eventData = {
         ...req.body,
         creator: user._id,
         image: req.file ? req.file.path : null
      };

      const event = await Event.create(eventData);
      user.createdEvents.push(event._id);
      await user.save();

      res.status(201).json(event);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get all events
router.get('/', async (req, res) => {
   try {
      const events = await Event.find()
         .populate('creator', 'name email')
         .sort({ createdAt: -1 });
      res.json(events);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get single event
router.get('/:id', async (req, res) => {
   try {
      const event = await Event.findById(req.params.id)
         .populate('creator', 'name email')
         .populate('comments.user', 'name email');
      
      if (!event) {
         return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Update event
router.put('/:id', upload.single('image'), async (req, res) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await jwt.verify(token, process.env.JWT_SECRET);
      const event = await Event.findById(req.params.id);

      if (!event) {
         return res.status(404).json({ error: 'Event not found' });
      }

      if (event.creator.toString() !== userData.id) {
         return res.status(403).json({ error: 'Not authorized to update this event' });
      }

      const updateData = {
         ...req.body,
         image: req.file ? req.file.path : event.image
      };

      const updatedEvent = await Event.findByIdAndUpdate(
         req.params.id,
         updateData,
         { new: true }
      );

      res.json(updatedEvent);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Delete event
router.delete('/:id', async (req, res) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await jwt.verify(token, process.env.JWT_SECRET);
      const event = await Event.findById(req.params.id);

      if (!event) {
         return res.status(404).json({ error: 'Event not found' });
      }

      if (event.creator.toString() !== userData.id) {
         return res.status(403).json({ error: 'Not authorized to delete this event' });
      }

      await event.remove();
      res.json({ message: 'Event deleted successfully' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Add comment to event
router.post('/:id/comments', async (req, res) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await jwt.verify(token, process.env.JWT_SECRET);
      const event = await Event.findById(req.params.id);

      if (!event) {
         return res.status(404).json({ error: 'Event not found' });
      }

      event.comments.push({
         user: userData.id,
         text: req.body.text
      });

      await event.save();
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Like event
router.post('/:id/like', async (req, res) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         return res.status(401).json({ error: 'Not authenticated' });
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
         return res.status(404).json({ error: 'Event not found' });
      }

      event.likes += 1;
      await event.save();
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router; 