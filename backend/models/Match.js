const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required'],
    unique: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer ID is required']
  },
  matchType: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public'
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true, // Only unique if not null
    default: null
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [2, 'Capacity must be at least 2 players']
  },
  currentPlayers: {
    type: Number,
    default: 1,
    min: 0
  },
  matchStatus: {
    type: String,
    enum: ['Open', 'Full', 'InProgress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  fieldAssignment: {
    type: String,
    default: null
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: {
      type: Date,
      default: null
    },
    isOrganizer: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Active', 'Left', 'Kicked'],
      default: 'Active'
    }
  }],
  chatEnabled: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance
MatchSchema.index({ bookingId: 1 });
MatchSchema.index({ organizerId: 1 });
MatchSchema.index({ matchStatus: 1 });
MatchSchema.index({ inviteCode: 1 });
MatchSchema.index({ matchType: 1, matchStatus: 1 });

// Generate invite code for private matches
MatchSchema.pre('save', function(next) {
  if (this.matchType === 'Private' && !this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Update match status based on capacity
MatchSchema.pre('save', function(next) {
  const activeParticipants = this.participants.filter(p => p.status === 'Active').length;
  this.currentPlayers = activeParticipants;
  
  if (activeParticipants >= this.capacity && this.matchStatus === 'Open') {
    this.matchStatus = 'Full';
  } else if (activeParticipants < this.capacity && this.matchStatus === 'Full') {
    this.matchStatus = 'Open';
  }
  
  next();
});

// Method to add participant
MatchSchema.methods.addParticipant = function(userId, isOrganizer = false) {
  const exists = this.participants.some(p => p.userId.toString() === userId.toString() && p.status === 'Active');
  
  if (exists) {
    throw new Error('User is already a participant');
  }
  
  if (this.currentPlayers >= this.capacity) {
    throw new Error('Match is full');
  }
  
  this.participants.push({
    userId,
    isOrganizer,
    status: 'Active'
  });
  
  return this.save();
};

// Method to remove participant
MatchSchema.methods.removeParticipant = function(userId, reason = 'Left') {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString() && p.status === 'Active'
  );
  
  if (!participant) {
    throw new Error('Participant not found');
  }
  
  participant.status = reason;
  participant.leftAt = new Date();
  
  return this.save();
};

// Virtual for available slots
MatchSchema.virtual('availableSlots').get(function() {
  return this.capacity - this.currentPlayers;
});

// Virtual to check if match is joinable
MatchSchema.virtual('isJoinable').get(function() {
  return this.matchStatus === 'Open' && this.currentPlayers < this.capacity;
});

module.exports = mongoose.model('Match', MatchSchema);
