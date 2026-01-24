const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: [true, 'Court ID is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number, // in minutes
    required: false // Auto-calculated in pre-save hook
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR'],
    default: 'EGP'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  qrCode: {
    type: String,
    default: null
  },
  cancellationReason: {
    type: String,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance
BookingSchema.index({ userId: 1 });
BookingSchema.index({ courtId: 1 });
BookingSchema.index({ startTime: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ courtId: 1, startTime: 1 });

// Compound index to prevent double bookings
BookingSchema.index({ 
  courtId: 1, 
  startTime: 1, 
  endTime: 1,
  status: 1 
}, { 
  unique: true,
  partialFilterExpression: { 
    status: { $in: ['Pending', 'Confirmed'] } 
  }
});

// Calculate duration before saving
BookingSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = (this.endTime - this.startTime) / (1000 * 60); // Convert to minutes
  }
  next();
});

// Virtual to check if booking is in the past
BookingSchema.virtual('isPast').get(function() {
  return this.endTime < new Date();
});

// Virtual to check if booking is upcoming
BookingSchema.virtual('isUpcoming').get(function() {
  return this.startTime > new Date();
});

// Virtual to check if booking is active
BookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startTime <= now && this.endTime >= now;
});

module.exports = mongoose.model('Booking', BookingSchema);
