const mongoose = require('mongoose');

const SPORT_TYPES = ['Football', 'Tennis', 'Basketball', 'Paddle', 'Volleyball', 'Squash', 'Badminton'];

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Eliminated', 'Winner', 'RunnerUp'],
    default: 'Pending'
  }
}, { _id: true });

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  nameAr: {
    type: String,
    trim: true,
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: null
  },
  descriptionAr: {
    type: String,
    trim: true,
    default: null
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer ID is required']
  },
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    default: null
  },
  sportType: {
    type: String,
    enum: SPORT_TYPES,
    required: [true, 'Sport type is required']
  },
  format: {
    type: String,
    enum: ['SingleElimination', 'DoubleElimination', 'RoundRobin', 'Swiss'],
    default: 'SingleElimination'
  },
  status: {
    type: String,
    enum: ['Draft', 'Open', 'InProgress', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  maxTeams: {
    type: Number,
    required: [true, 'Max teams is required'],
    min: [2, 'Tournament must have at least 2 teams']
  },
  minTeamSize: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  maxTeamSize: {
    type: Number,
    required: true,
    default: 11
  },
  entryFee: {
    type: Number,
    default: 0,
    min: [0, 'Entry fee cannot be negative']
  },
  prizePool: {
    type: Number,
    default: 0,
    min: [0, 'Prize pool cannot be negative']
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR'],
    default: 'EGP'
  },
  rules: {
    type: String,
    maxlength: [3000, 'Rules cannot exceed 3000 characters'],
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  teams: [TeamSchema],
  winner: {
    teamName: { type: String, default: null },
    captainId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
TournamentSchema.index({ organizerId: 1 });
TournamentSchema.index({ sportType: 1, status: 1 });
TournamentSchema.index({ startDate: 1 });
TournamentSchema.index({ registrationDeadline: 1 });
TournamentSchema.index({ isPublic: 1, status: 1 });

// Virtuals
TournamentSchema.virtual('registeredTeamsCount').get(function () {
  return this.teams.filter(t => t.status !== 'Pending').length;
});

TournamentSchema.virtual('availableSlots').get(function () {
  return this.maxTeams - this.teams.length;
});

TournamentSchema.virtual('isRegistrationOpen').get(function () {
  return (
    this.status === 'Open' &&
    this.registrationDeadline > new Date() &&
    this.teams.length < this.maxTeams
  );
});

// Prevent start date after end date
TournamentSchema.pre('save', function (next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('Start date must be before end date'));
  }
  if (this.registrationDeadline >= this.startDate) {
    return next(new Error('Registration deadline must be before start date'));
  }
  next();
});

// Set completedAt when tournament is marked Completed
TournamentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'Completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Method: check if a user is registered
TournamentSchema.methods.isUserRegistered = function (userId) {
  return this.teams.some(t =>
    t.captainId.toString() === userId.toString() ||
    t.members.some(m => m.toString() === userId.toString())
  );
};

module.exports = mongoose.model('Tournament', TournamentSchema);
