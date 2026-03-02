const Match = require('../models/Match');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// helper to check ownership
const isOrganizer = (match, userId) => match.organizerId.toString() === userId.toString();

/**
 * Create a match linked to a booking
 */
const createMatch = async (req, res) => {
  try {
    const {
      bookingId,
      matchType,
      capacity,
      notes
    } = req.body;

    if (!bookingId || !capacity) {
      return res.status(400).json({ success: false, message: 'bookingId and capacity are required' });
    }

    // ensure booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // only booking user or court owner can create match? we'll allow organizer becomes current user

    const match = await Match.create({
      bookingId,
      organizerId: req.userId,
      matchType: matchType || 'Public',
      capacity,
      notes: notes || null,
      participants: [{ userId: req.userId, isOrganizer: true }]
    });

    res.status(201).json({ success: true, message: 'Match created', data: match });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Match already exists for this booking or invite code conflict' });
    }
    res.status(500).json({ success: false, message: error.message || 'Error creating match' });
  }
};

/**
 * List matches with optional filters
 */
const getAllMatches = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, matchType, organizerId } = req.query;
    const filter = {};

    if (status) filter.matchStatus = status;
    if (matchType) filter.matchType = matchType;
    if (organizerId) filter.organizerId = mongoose.Types.ObjectId(organizerId);

    const skip = (page - 1) * limit;
    const matches = await Match.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('bookingId')
      .populate('organizerId', 'fullName email');

    const total = await Match.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: matches,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving matches' });
  }
};

/**
 * Get match by ID or invite code
 */
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    let match;

    if (mongoose.Types.ObjectId.isValid(id)) {
      match = await Match.findById(id)
        .populate('bookingId')
        .populate('organizerId', 'fullName email');
    }
    if (!match) {
      // try invite code
      match = await Match.findOne({ inviteCode: id })
        .populate('bookingId')
        .populate('organizerId', 'fullName email');
    }

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching match' });
  }
};

/**
 * Update match (only organizer or admin)
 */
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (req.userRole !== 'Admin' && !isOrganizer(match, req.userId)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    // disallow altering organizer/booking
    delete update.organizerId;
    delete update.bookingId;
    delete update.participants;

    Object.assign(match, update);
    await match.save();

    res.status(200).json({ success: true, message: 'Match updated', data: match });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }
    res.status(500).json({ success: false, message: error.message || 'Error updating match' });
  }
};

/**
 * Delete match
 */
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (req.userRole !== 'Admin' && !isOrganizer(match, req.userId)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    await Match.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Match deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting match' });
  }
};

/**
 * Join a match (by id or invite code)
 */
const joinMatch = async (req, res) => {
  try {
    const { id } = req.params;
    let match;

    if (mongoose.Types.ObjectId.isValid(id)) {
      match = await Match.findById(id);
    }
    if (!match) {
      match = await Match.findOne({ inviteCode: id });
    }
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    await match.addParticipant(req.userId);
    res.status(200).json({ success: true, message: 'Joined match', data: match });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Leave a match
 */
const leaveMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    await match.removeParticipant(req.userId);
    res.status(200).json({ success: true, message: 'Left match', data: match });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMatch,
  getAllMatches,
  getMatchById,
  updateMatch,
  deleteMatch,
  joinMatch,
  leaveMatch
};
