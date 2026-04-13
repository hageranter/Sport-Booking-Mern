const mongoose = require('mongoose');

/**
 * TimeSlot – pre-generated availability slots for a court on a given day.
 * Dynamic pricing algorithm (from graduation project):
 *   multiplier = 1.0 (Low demand)
 *   multiplier = 1.2 (Medium demand)
 *   multiplier = 1.5 (High demand)
 *   if isPeakTime: multiplier += 0.3
 *   finalPrice = basePrice * multiplier
 */
const TimeSlotSchema = new mongoose.Schema({
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: [true, 'Court ID is required']
  },
  // The calendar date this slot belongs to (stored as start of day UTC)
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  durationMinutes: {
    type: Number,
    default: 60,
    min: [30, 'Slot must be at least 30 minutes']
  },

  // Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  demandLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  isPeakTime: {
    type: Boolean,
    default: false
  },
  priceMultiplier: {
    type: Number,
    default: 1.0,
    min: 1.0
  },
  finalPrice: {
    type: Number,
    min: [0, 'Final price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR'],
    default: 'EGP'
  },

  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
TimeSlotSchema.index({ courtId: 1, date: 1 });
TimeSlotSchema.index({ courtId: 1, startTime: 1, endTime: 1 });
TimeSlotSchema.index({ courtId: 1, isAvailable: 1, date: 1 });
// Prevent duplicate slots for same court at same time
TimeSlotSchema.index({ courtId: 1, startTime: 1 }, { unique: true });

// Calculate priceMultiplier and finalPrice before saving (algorithm 5 — Dynamic Pricing)
TimeSlotSchema.pre('save', function (next) {
  let multiplier = 1.0;

  if (this.demandLevel === 'High') {
    multiplier = 1.5;
  } else if (this.demandLevel === 'Medium') {
    multiplier = 1.2;
  }

  if (this.isPeakTime) {
    multiplier += 0.3;
  }

  this.priceMultiplier = Math.round(multiplier * 100) / 100;
  this.finalPrice = Math.round(this.basePrice * this.priceMultiplier * 100) / 100;
  next();
});

// Mark slot as booked
TimeSlotSchema.methods.book = function (bookingId) {
  this.isAvailable = false;
  this.bookingId = bookingId;
  return this.save();
};

// Release slot (on cancellation)
TimeSlotSchema.methods.release = function () {
  this.isAvailable = true;
  this.bookingId = null;
  return this.save();
};

/**
 * Static: generate slots for a court on a given date.
 * @param {ObjectId} courtId
 * @param {Date}     date
 * @param {number}   basePrice
 * @param {string}   openTime   e.g. '06:00'
 * @param {string}   closeTime  e.g. '23:00'
 * @param {number}   durationMinutes default 60
 * @param {string}   currency
 * @param {string[]} peakHours  e.g. ['17:00','18:00','19:00','20:00']
 */
TimeSlotSchema.statics.generateSlotsForDay = async function (
  courtId, date, basePrice,
  openTime = '06:00', closeTime = '23:00',
  durationMinutes = 60, currency = 'EGP',
  peakHours = ['17:00', '18:00', '19:00', '20:00', '21:00']
) {
  const slots = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);

  const dayStart = new Date(date);
  dayStart.setUTCHours(0, 0, 0, 0);

  let current = new Date(dayStart);
  current.setUTCHours(openH, openM, 0, 0);

  const end = new Date(dayStart);
  end.setUTCHours(closeH, closeM, 0, 0);

  while (current < end) {
    const slotEnd = new Date(current.getTime() + durationMinutes * 60 * 1000);
    if (slotEnd > end) break;

    const hour = `${String(current.getUTCHours()).padStart(2, '0')}:${String(current.getUTCMinutes()).padStart(2, '0')}`;
    const isPeakTime = peakHours.includes(hour);

    slots.push({
      courtId,
      date: dayStart,
      startTime: new Date(current),
      endTime: new Date(slotEnd),
      durationMinutes,
      basePrice,
      isPeakTime,
      demandLevel: 'Low', // Updated dynamically based on booking patterns
      currency
    });

    current = slotEnd;
  }

  // Insert only slots that don't already exist
  return this.insertMany(slots, { ordered: false }).catch(err => {
    if (err.code === 11000) return []; // duplicate key – slots already exist
    throw err;
  });
};

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
