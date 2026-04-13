const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['Email', 'SMS', 'Push', 'InApp'],
    default: 'InApp'
  },
  category: {
    type: String,
    enum: ['Booking', 'Match', 'Payment', 'Review', 'System', 'Promotion', 'Tournament', 'Support'],
    required: [true, 'Category is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  titleAr: {
    type: String,
    maxlength: [100, 'Arabic title cannot exceed 100 characters'],
    default: null
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  messageAr: {
    type: String,
    maxlength: [500, 'Arabic message cannot exceed 500 characters'],
    default: null
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  relatedModel: {
    type: String,
    enum: ['Booking', 'Match', 'Payment', 'Review', 'Court', 'Tournament', 'SupportTicket', null],
    default: null
  },
  actionUrl: {
    type: String,
    default: null
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Sent', 'Failed', 'Delivered'],
    default: 'Pending'
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, category: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ deliveryStatus: 1 });

// Mark notification as read
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Mark notification as sent
NotificationSchema.methods.markAsSent = function() {
  this.deliveryStatus = 'Sent';
  this.sentAt = new Date();
  return this.save();
};

// Mark notification as failed
NotificationSchema.methods.markAsFailed = function(reason) {
  this.deliveryStatus = 'Failed';
  this.failureReason = reason;
  return this.save();
};

module.exports = mongoose.model('Notification', NotificationSchema);
