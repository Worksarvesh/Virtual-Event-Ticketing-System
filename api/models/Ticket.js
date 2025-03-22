const mongoose = require("mongoose");
const crypto = require('crypto');

const ticketSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
   ticketDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      eventName: { type: String, required: true },
      eventDate: { type: Date, required: true },
      eventTime: { type: String, required: true },
      ticketPrice: { type: Number, required: true },
      ticketCode: { type: String, unique: true, required: true },
      isUsed: { type: Boolean, default: false },
      usedAt: { type: Date },
      purchaseDate: { type: Date, default: Date.now }
   },
   status: {
      type: String,
      enum: ['active', 'used', 'cancelled'],
      default: 'active'
   },
   count: { type: Number, default: 1 }
});

// Generate unique ticket code before saving
ticketSchema.pre('save', function(next) {
   if (!this.ticketDetails.ticketCode) {
      this.ticketDetails.ticketCode = crypto.randomBytes(16).toString('hex');
   }
   next();
});

// Method to validate ticket
ticketSchema.methods.validateTicket = function() {
   return this.status === 'active' && !this.ticketDetails.isUsed;
};

// Method to use ticket
ticketSchema.methods.useTicket = function() {
   if (this.validateTicket()) {
      this.ticketDetails.isUsed = true;
      this.ticketDetails.usedAt = new Date();
      this.status = 'used';
      return true;
   }
   return false;
};

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;