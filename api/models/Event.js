const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
   creator: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
   },
   title: { 
      type: String, 
      required: true 
   },
   description: { 
      type: String, 
      required: true 
   },
   organizedBy: { 
      type: String, 
      required: true 
   },
   eventDate: { 
      type: Date, 
      required: true 
   },
   eventTime: { 
      type: String, 
      required: true 
   },
   location: { 
      type: String, 
      required: true 
   },
   maxParticipants: { 
      type: Number, 
      required: true 
   },
   currentParticipants: { 
      type: Number, 
      default: 0 
   },
   ticketPrice: { 
      type: Number, 
      required: true 
   },
   availableTickets: { 
      type: Number, 
      required: true 
   },
   soldTickets: { 
      type: Number, 
      default: 0 
   },
   totalRevenue: { 
      type: Number, 
      default: 0 
   },
   image: { 
      type: String 
   },
   youtubeVideoId: { 
      type: String 
   },
   status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'draft'
   },
   likes: { 
      type: Number, 
      default: 0 
   },
   comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
   }],
   createdAt: { 
      type: Date, 
      default: Date.now 
   },
   updatedAt: { 
      type: Date, 
      default: Date.now 
   }
});

// Update the updatedAt timestamp before saving
eventSchema.pre('save', function(next) {
   this.updatedAt = Date.now();
   next();
});

// Method to check if event is full
eventSchema.methods.isFull = function() {
   return this.currentParticipants >= this.maxParticipants;
};

// Method to check if event is available for purchase
eventSchema.methods.isAvailable = function() {
   return this.status === 'published' && 
          !this.isFull() && 
          this.eventDate > new Date();
};

const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel; 