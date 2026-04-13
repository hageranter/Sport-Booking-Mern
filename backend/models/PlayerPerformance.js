const mongoose = require('mongoose');

const SPORT_TYPES = ['Football', 'Tennis', 'Basketball', 'Paddle', 'Volleyball', 'Squash', 'Badminton'];

const PlayerPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  sportType: {
    type: String,
    enum: SPORT_TYPES,
    required: [true, 'Sport type is required']
  },

  // Match stats
  totalMatches: { type: Number, default: 0, min: 0 },
  totalWins:    { type: Number, default: 0, min: 0 },
  totalLosses:  { type: Number, default: 0, min: 0 },
  totalDraws:   { type: Number, default: 0, min: 0 },

  // Booking / court usage
  totalBookings:     { type: Number, default: 0, min: 0 },
  totalHoursPlayed:  { type: Number, default: 0, min: 0 },

  // Tournament history
  tournamentsPlayed: { type: Number, default: 0, min: 0 },
  tournamentsWon:    { type: Number, default: 0, min: 0 },

  // Derived / calculated fields
  winRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Beginner'
  },

  // Sport-specific flexible stats
  // Football: { goals, assists, yellowCards, redCards }
  // Tennis:   { aces, doubleFaults, setsWon }
  // Basketball: { points, rebounds, assists }
  // Paddle/Squash/Badminton: { pointsScored, setsWon }
  sportStats: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  lastMatchDate: {
    type: Date,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// One record per user per sport
PlayerPerformanceSchema.index({ userId: 1, sportType: 1 }, { unique: true });
PlayerPerformanceSchema.index({ sportType: 1, winRate: -1 });
PlayerPerformanceSchema.index({ userId: 1 });

// Recalculate winRate and level before saving (algorithm 8)
PlayerPerformanceSchema.pre('save', function (next) {
  // Win rate
  if (this.totalMatches > 0) {
    this.winRate = Math.round((this.totalWins / this.totalMatches) * 100);
  } else {
    this.winRate = 0;
  }

  // Auto-level based on matches + win rate
  if (this.totalMatches >= 100 && this.winRate >= 60) {
    this.level = 'Professional';
  } else if (this.totalMatches >= 50 && this.winRate >= 50) {
    this.level = 'Advanced';
  } else if (this.totalMatches >= 10) {
    this.level = 'Intermediate';
  } else {
    this.level = 'Beginner';
  }

  this.lastUpdated = new Date();
  next();
});

// Static: update performance after a match result (algorithm 8 — Performance Tracking)
PlayerPerformanceSchema.statics.recordMatchResult = async function (userId, sportType, result, hoursPlayed = 1) {
  const update = {
    $inc: {
      totalMatches: 1,
      totalHoursPlayed: hoursPlayed,
      ...(result === 'Win'  && { totalWins:   1 }),
      ...(result === 'Loss' && { totalLosses: 1 }),
      ...(result === 'Draw' && { totalDraws:  1 })
    },
    $set: { lastMatchDate: new Date() }
  };

  return this.findOneAndUpdate(
    { userId, sportType },
    update,
    { upsert: true, new: true, runValidators: true }
  );
};

// Static: update sport-specific stats (goals, aces, etc.)
PlayerPerformanceSchema.statics.updateSportStats = async function (userId, sportType, statsUpdate) {
  const inc = {};
  for (const [key, val] of Object.entries(statsUpdate)) {
    inc[`sportStats.${key}`] = val;
  }
  return this.findOneAndUpdate(
    { userId, sportType },
    { $inc: inc, $set: { lastUpdated: new Date() } },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('PlayerPerformance', PlayerPerformanceSchema);
