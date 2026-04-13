const mongoose = require('mongoose');

const NotificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  email: {
    enabled: {
      type: Boolean,
      default: true
    },
    bookingConfirmation: {
      type: Boolean,
      default: true
    },
    bookingReminder: {
      type: Boolean,
      default: true
    },
    bookingCancellation: {
      type: Boolean,
      default: true
    },
    matchInvitation: {
      type: Boolean,
      default: true
    },
    matchUpdates: {
      type: Boolean,
      default: true
    },
    paymentReceipt: {
      type: Boolean,
      default: true
    },
    newReview: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: false
    }
  },
  sms: {
    enabled: {
      type: Boolean,
      default: false
    },
    bookingConfirmation: {
      type: Boolean,
      default: false
    },
    bookingReminder: {
      type: Boolean,
      default: false
    }
  },
  push: {
    enabled: {
      type: Boolean,
      default: true
    },
    bookingReminder: {
      type: Boolean,
      default: true
    },
    matchUpdates: {
      type: Boolean,
      default: true
    },
    chatMessages: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: false
    }
  },
  inApp: {
    enabled: {
      type: Boolean,
      default: true
    },
    all: {
      type: Boolean,
      default: true
    }
  },
  reminderTiming: {
    type: Number, // minutes before booking
    default: 60,
    min: 15,
    max: 1440 // 24 hours
  },
  quietHours: {
    enabled: {
      type: Boolean,
      default: false
    },
    start: {
      type: String,
      default: '22:00'
    },
    end: {
      type: String,
      default: '08:00'
    }
  }
}, {
  timestamps: true
});

// Index (userId already indexed via unique:true)

// Method to check if notification type is enabled
NotificationSettingsSchema.methods.isEnabled = function(type, category) {
  const typeSettings = this[type.toLowerCase()];
  
  if (!typeSettings || !typeSettings.enabled) {
    return false;
  }
  
  if (category && typeSettings[category] !== undefined) {
    return typeSettings[category];
  }
  
  return true;
};

// Method to check if in quiet hours
NotificationSettingsSchema.methods.isInQuietHours = function() {
  if (!this.quietHours.enabled) {
    return false;
  }
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const start = this.quietHours.start;
  const end = this.quietHours.end;
  
  if (start < end) {
    return currentTime >= start && currentTime <= end;
  } else {
    return currentTime >= start || currentTime <= end;
  }
};

module.exports = mongoose.model('NotificationSettings', NotificationSettingsSchema);
