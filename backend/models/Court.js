const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Court name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  sportType: {
    type: String,
    enum: ['Football', 'Tennis', 'Basketball', 'Paddle', 'Volleyball', 'Squash', 'Badminton'],
    required: [true, 'Sport type is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    governorate: {
      type: String,
      required: [true, 'Governorate is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        default: null
      },
      longitude: {
        type: Number,
        default: null
      }
    }
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR'],
    default: 'EGP'
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [2, 'Capacity must be at least 2 players']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  operatingHours: {
    start: {
      type: String,
      required: true,
      default: '06:00'
    },
    end: {
      type: String,
      required: true,
      default: '23:00'
    }
  },
  availableDays: [{
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }],
  slotDurationMinutes: {
    type: Number,
    default: 60,
    min: [30, 'Slot duration must be at least 30 minutes'],
    max: [240, 'Slot duration cannot exceed 240 minutes']
  },
  peakHours: [{
    type: String // e.g. ['17:00', '18:00', '19:00', '20:00', '21:00']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
CourtSchema.index({ ownerId: 1 });
CourtSchema.index({ sportType: 1 });
CourtSchema.index({ 'location.city': 1 });
CourtSchema.index({ 'location.governorate': 1 });
CourtSchema.index({ isActive: 1, isVerified: 1 });
CourtSchema.index({ averageRating: -1 });
CourtSchema.index({ pricePerHour: 1 });

// Text search index
CourtSchema.index({ name: 'text', description: 'text' });

// Virtual for primary image
CourtSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Ensure only one primary image
CourtSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    } else if (primaryImages.length === 0) {
      // Set first image as primary
      this.images[0].isPrimary = true;
    }
  }
  next();
});

module.exports = mongoose.model('Court', CourtSchema);
