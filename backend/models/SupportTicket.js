const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  attachments: [{
    type: String // file URLs
  }],
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const SupportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  category: {
    type: String,
    enum: ['Booking', 'Payment', 'Court', 'Match', 'Tournament', 'Account', 'Technical', 'Other'],
    required: [true, 'Category is required']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'InProgress', 'WaitingUser', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin/Staff user
    default: null
  },

  // Link to the entity this ticket is about
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  relatedModel: {
    type: String,
    enum: ['Booking', 'Payment', 'Court', 'Match', 'Tournament', null],
    default: null
  },

  messages: [MessageSchema],

  // Resolution
  resolvedAt:  { type: Date, default: null },
  closedAt:    { type: Date, default: null },
  // User satisfaction rating after resolution (1–5)
  rating:      { type: Number, min: 1, max: 5, default: null },
  ratingNote:  { type: String, maxlength: 500, default: null }
}, {
  timestamps: true
});

// Indexes (ticketNumber already indexed via unique:true)
SupportTicketSchema.index({ userId: 1, status: 1, createdAt: -1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ status: 1, priority: 1 });

// Auto-generate ticket number on create
SupportTicketSchema.pre('save', function (next) {
  if (this.isNew && !this.ticketNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.ticketNumber = `TKT-${timestamp}-${random}`;
  }
  next();
});

// Set resolvedAt / closedAt timestamps on status change
SupportTicketSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    if (this.status === 'Closed' && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
  next();
});

// Method: add a message to the thread
SupportTicketSchema.methods.addMessage = function (senderId, content, isStaff = false, attachments = []) {
  this.messages.push({ senderId, content, isStaff, attachments });

  // If staff replies, move to InProgress; if user replies, move to WaitingUser
  if (this.status === 'Open' && isStaff) {
    this.status = 'InProgress';
  } else if (this.status === 'Resolved' && !isStaff) {
    this.status = 'Open'; // Re-open if user replies after resolution
  }

  return this.save();
};

// Virtual: response time in hours (time from created to first staff reply)
SupportTicketSchema.virtual('firstResponseHours').get(function () {
  const firstStaffMsg = this.messages.find(m => m.isStaff);
  if (!firstStaffMsg) return null;
  return Math.round((firstStaffMsg.sentAt - this.createdAt) / (1000 * 60 * 60) * 10) / 10;
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
