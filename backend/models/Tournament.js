const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tournament name is required'],
        maxlength: [100, 'Tournament name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: null
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Organizer ID is required']
    },
    sportTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SportType',
        required: [true, 'Sport type is required']
    },
    format: {
        type: String,
        enum: ['SingleElimination', 'DoubleElimination', 'RoundRobin', 'GroupStage'],
        default: 'SingleElimination'
    },
    status: {
        type: String,
        enum: ['Draft', 'Registration', 'InProgress', 'Completed', 'Cancelled'],
        default: 'Draft'
    },
    tournamentType: {
        type: String,
        enum: ['Public', 'Private', 'Invite-Only'],
        default: 'Public'
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Max participants is required'],
        min: [2, 'Max participants must be at least 2'],
        max: [1000, 'Max participants cannot exceed 1000']
    },
    registeredParticipants: {
        type: Number,
        default: 0,
        min: 0
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Registered', 'Active', 'Eliminated', 'Withdrawn'],
            default: 'Registered'
        },
        seed: {
            type: Number,
            default: null
        },
        teamName: {
            type: String,
            default: null
        }
    }],
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        default: null
    },
    registrationDeadline: {
        type: Date,
        required: [true, 'Registration deadline is required']
    },
    location: {
        type: String,
        default: null
    },
    courtIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court'
    }],
    entryFee: {
        type: Number,
        default: 0,
        min: 0
    },
    prizePool: {
        firstPlace: {
            type: Number,
            default: 0
        },
        secondPlace: {
            type: Number,
            default: 0
        },
        thirdPlace: {
            type: Number,
            default: 0
        }
    },
    rules: {
        type: String,
        default: null
    },
    inviteCode: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    },
    matchIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    bannerImage: {
        type: String,
        default: null
    },
    contactEmail: {
        type: String,
        match: [/.+\@.+\..+/, 'Please provide a valid email']
    },
    contactPhone: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for performance
TournamentSchema.index({ organizerId: 1 });
TournamentSchema.index({ sportTypeId: 1 });
TournamentSchema.index({ status: 1 });
TournamentSchema.index({ tournamentType: 1 });
TournamentSchema.index({ startDate: 1 });
TournamentSchema.index({ registrationDeadline: 1 });
TournamentSchema.index({ inviteCode: 1 });

// Generate invite code for private tournaments
TournamentSchema.pre('save', function (next) {
    if (this.tournamentType === 'Invite-Only' && !this.inviteCode) {
        this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});

// Update registeredParticipants count
TournamentSchema.pre('save', function (next) {
    const activeParticipants = this.participants.filter(
        p => p.status === 'Registered' || p.status === 'Active'
    ).length;
    this.registeredParticipants = activeParticipants;
    next();
});

// Virtual to check if tournament is joinable
TournamentSchema.virtual('isJoinable').get(function () {
    return (
        this.status === 'Registration' &&
        this.registeredParticipants < this.maxParticipants &&
        new Date() < this.registrationDeadline
    );
});

// Virtual for available slots
TournamentSchema.virtual('availableSlots').get(function () {
    return this.maxParticipants - this.registeredParticipants;
});

// Method to add participant
TournamentSchema.methods.addParticipant = function (userId, teamName = null) {
    const exists = this.participants.some(
        p => p.userId.toString() === userId.toString()
    );

    if (exists) {
        throw new Error('User is already registered in this tournament');
    }

    if (this.registeredParticipants >= this.maxParticipants) {
        throw new Error('Tournament is full');
    }

    if (new Date() > this.registrationDeadline) {
        throw new Error('Registration deadline has passed');
    }

    this.participants.push({
        userId,
        status: 'Registered',
        teamName
    });

    return this.save();
};

// Method to remove participant
TournamentSchema.methods.removeParticipant = function (userId) {
    const participant = this.participants.find(
        p => p.userId.toString() === userId.toString()
    );

    if (!participant) {
        throw new Error('Participant not found');
    }

    participant.status = 'Withdrawn';
    return this.save();
};

// Method to get active participants
TournamentSchema.methods.getActiveParticipants = function () {
    return this.participants.filter(p =>
        p.status === 'Registered' || p.status === 'Active'
    );
};

module.exports = mongoose.model('Tournament', TournamentSchema);
