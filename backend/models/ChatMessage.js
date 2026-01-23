const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: [true, 'Match ID is required']
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },
  messageType: {
    type: String,
    enum: ['Text', 'System', 'Image', 'Location'],
    default: 'Text'
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  imageUrl: {
    type: String,
    default: null
  },
  location: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
ChatMessageSchema.index({ matchId: 1, createdAt: -1 });
ChatMessageSchema.index({ senderId: 1 });
ChatMessageSchema.index({ matchId: 1, isDeleted: 1 });

// Method to mark message as read
ChatMessageSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.some(r => r.userId.toString() === userId.toString());
  
  if (!alreadyRead) {
    this.readBy.push({ userId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to edit message
ChatMessageSchema.methods.editMessage = function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Method to soft delete message
ChatMessageSchema.methods.deleteMessage = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.content = 'This message was deleted';
  return this.save();
};

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
