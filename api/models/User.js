const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['creator', 'attendee'], 
    default: 'attendee' 
  },
  createdEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  purchasedTickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
  youtubeAccessToken: { type: String },
  youtubeRefreshToken: { type: String },
  youtubeTokenExpiry: { type: Date },
  youtubeChannelId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if YouTube token is expired
UserSchema.methods.isYoutubeTokenExpired = function() {
  return !this.youtubeTokenExpiry || this.youtubeTokenExpiry <= new Date();
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;