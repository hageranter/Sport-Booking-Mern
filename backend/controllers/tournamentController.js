const Tournament = require('../models/Tournament');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to verify organizer
const isOrganizer = (tournament, userId) =>
    tournament.organizerId.toString() === userId.toString();

/**
 * Create a new tournament
 */
const createTournament = async (req, res) => {
    try {
        const {
            name,
            description,
            sportTypeId,
            format,
            tournamentType,
            maxParticipants,
            startDate,
            endDate,
            registrationDeadline,
            location,
            courtIds,
            entryFee,
            prizePool,
            rules,
            contactEmail,
            contactPhone,
            bannerImage
        } = req.body;

        // Validation
        if (!name || !sportTypeId || !maxParticipants || !startDate || !registrationDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: name, sportTypeId, maxParticipants, startDate, registrationDeadline'
            });
        }

        // Verify dates
        if (new Date(registrationDeadline) > new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline must be before tournament start date'
            });
        }

        const tournament = await Tournament.create({
            name,
            description,
            organizerId: req.userId,
            sportTypeId,
            format: format || 'SingleElimination',
            tournamentType: tournamentType || 'Public',
            maxParticipants,
            startDate,
            endDate,
            registrationDeadline,
            location,
            courtIds: courtIds || [],
            entryFee: entryFee || 0,
            prizePool: prizePool || { firstPlace: 0, secondPlace: 0, thirdPlace: 0 },
            rules,
            contactEmail,
            contactPhone,
            bannerImage
        });

        res.status(201).json({
            success: true,
            message: 'Tournament created successfully',
            data: tournament
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating tournament'
        });
    }
};

/**
 * Get all tournaments with pagination and filters
 */
const getTournaments = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, sportTypeId, tournamentType } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (status) filter.status = status;
        if (sportTypeId) filter.sportTypeId = sportTypeId;
        if (tournamentType) filter.tournamentType = tournamentType;

        const tournaments = await Tournament.find(filter)
            .populate('organizerId', 'username email profileImage')
            .populate('sportTypeId', 'name')
            .populate('participants.userId', 'username email profileImage')
            .limit(limit * 1)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Tournament.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: tournaments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching tournaments'
        });
    }
};

/**
 * Get a single tournament by ID
 */
const getTournamentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id)
            .populate('organizerId', 'username email profileImage')
            .populate('sportTypeId', 'name')
            .populate('participants.userId', 'username email profileImage')
            .populate('courtIds', 'name location')
            .populate('matchIds')
            .populate('winner', 'username email');

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        res.status(200).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching tournament'
        });
    }
};

/**
 * Update tournament (only by organizer)
 */
const updateTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        if (!isOrganizer(tournament, req.userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only organizer can update this tournament'
            });
        }

        // Prevent status updates through this endpoint
        if (updates.status && updates.status !== tournament.status) {
            return res.status(400).json({
                success: false,
                message: 'Use dedicated endpoints to change tournament status'
            });
        }

        const updatedTournament = await Tournament.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Tournament updated successfully',
            data: updatedTournament
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating tournament'
        });
    }
};

/**
 * Delete tournament (only by organizer)
 */
const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        if (!isOrganizer(tournament, req.userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only organizer can delete this tournament'
            });
        }

        await Tournament.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Tournament deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting tournament'
        });
    }
};

/**
 * Register user to tournament
 */
const registerParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const { teamName } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        if (tournament.status !== 'Registration') {
            return res.status(400).json({
                success: false,
                message: 'Tournament is not accepting registrations'
            });
        }

        // For private tournaments, verify invite code
        if (tournament.tournamentType === 'Invite-Only') {
            const { inviteCode } = req.body;
            if (!inviteCode || inviteCode !== tournament.inviteCode) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or missing invite code'
                });
            }
        }

        await tournament.addParticipant(req.userId, teamName);

        res.status(200).json({
            success: true,
            message: 'Registered for tournament successfully',
            data: tournament
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error registering for tournament'
        });
    }
};

/**
 * Withdraw from tournament
 */
const withdrawParticipant = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        await tournament.removeParticipant(req.userId);

        res.status(200).json({
            success: true,
            message: 'Withdrawn from tournament successfully',
            data: tournament
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error withdrawing from tournament'
        });
    }
};

/**
 * Get participants of a tournament
 */
const getParticipants = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id)
            .populate('participants.userId', 'username email profileImage');

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        const skip = (page - 1) * limit;
        const participants = tournament.participants.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            success: true,
            data: participants,
            total: tournament.registeredParticipants,
            totalPages: Math.ceil(tournament.registeredParticipants / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching participants'
        });
    }
};

/**
 * Start tournament (change status to InProgress)
 */
const startTournament = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        if (!isOrganizer(tournament, req.userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only organizer can start this tournament'
            });
        }

        if (tournament.status !== 'Registration') {
            return res.status(400).json({
                success: false,
                message: 'Tournament must be in registration status to start'
            });
        }

        tournament.status = 'InProgress';
        await tournament.save();

        res.status(200).json({
            success: true,
            message: 'Tournament started successfully',
            data: tournament
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error starting tournament'
        });
    }
};

/**
 * Complete tournament
 */
const completeTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const { winnerId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        if (!isOrganizer(tournament, req.userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only organizer can complete this tournament'
            });
        }

        tournament.status = 'Completed';
        if (winnerId) {
            tournament.winner = winnerId;
        }
        tournament.endDate = new Date();
        await tournament.save();

        res.status(200).json({
            success: true,
            message: 'Tournament completed successfully',
            data: tournament
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error completing tournament'
        });
    }
};

/**
 * Cancel tournament
 */
const cancelTournament = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID'
            });
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        if (!isOrganizer(tournament, req.userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only organizer can cancel this tournament'
            });
        }

        tournament.status = 'Cancelled';
        await tournament.save();

        res.status(200).json({
            success: true,
            message: 'Tournament cancelled successfully',
            data: tournament
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error cancelling tournament'
        });
    }
};

/**
 * Get tournaments organized by user
 */
const getMyTournaments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const tournaments = await Tournament.find({ organizerId: req.userId })
            .populate('sportTypeId', 'name')
            .limit(limit * 1)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Tournament.countDocuments({ organizerId: req.userId });

        res.status(200).json({
            success: true,
            data: tournaments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching tournaments'
        });
    }
};

module.exports = {
    createTournament,
    getTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    registerParticipant,
    withdrawParticipant,
    getParticipants,
    startTournament,
    completeTournament,
    cancelTournament,
    getMyTournaments
};
