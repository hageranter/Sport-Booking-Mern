const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: [true, 'Court ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    default: null
  },
  pros: [{
    type: String,
    trim: true
  }],
  cons: [{
    type: String,
    trim: true
  }],
  isVerifiedBooking: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  hiddenReason: {
    type: String,
    default: null
  },
  ownerResponse: {
    content: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters'],
      default: null
    },
    respondedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
ReviewSchema.index({ courtId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ bookingId: 1 });
ReviewSchema.index({ courtId: 1, userId: 1 }, { unique: true }); // One review per user per court

// Update court average rating after save
ReviewSchema.post('save', async function() {
  const Court = mongoose.model('Court');
  
  const stats = await mongoose.model('Review').aggregate([
    { $match: { courtId: this.courtId, isHidden: false } },
    { $group: {
      _id: '$courtId',
      averageRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);
  
  if (stats.length > 0) {
    await Court.findByIdAndUpdate(this.courtId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
});

// Update court average rating after delete
ReviewSchema.post('remove', async function() {
  const Court = mongoose.model('Court');
  
  const stats = await mongoose.model('Review').aggregate([
    { $match: { courtId: this.courtId, isHidden: false } },
    { $group: {
      _id: '$courtId',
      averageRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);
  
  if (stats.length > 0) {
    await Court.findByIdAndUpdate(this.courtId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Court.findByIdAndUpdate(this.courtId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
