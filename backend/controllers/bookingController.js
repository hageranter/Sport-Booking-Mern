const Booking = require('../models/Booking');
const mongoose = require('mongoose');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res, next) => {
    try {
        const { courtId, startTime, endTime, totalPrice, currency, notes } = req.body;

        // basic validation
        if (!courtId || !startTime || !endTime || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'courtId, startTime, endTime and totalPrice are required'
            });
        }

        // create booking object
        const booking = new Booking({
            userId: req.userId,
            courtId,
            startTime,
            endTime,
            totalPrice,
            currency: currency || 'EGP',
            notes: notes || null
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key, likely overlapping booking
            return res.status(400).json({
                success: false,
                message: 'Time slot already booked for this court'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error creating booking'
        });
    }
};

/**
 * @desc    Get all bookings with optional filters
 * @route   GET /api/bookings
 * @access  Private (user can see own bookings, admin can see all)
 */
const getAllBookings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, courtId, userId } = req.query;
        const filter = {};

        // if not admin, restrict to current user
        if (req.userRole !== 'Admin') {
            filter.userId = mongoose.Types.ObjectId(req.userId);
        } else if (userId) {
            filter.userId = mongoose.Types.ObjectId(userId);
        }

        if (status) {
            filter.status = status;
        }

        if (courtId) {
            filter.courtId = mongoose.Types.ObjectId(courtId);
        }

        const skip = (page - 1) * limit;

        const bookings = await Booking.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .populate('courtId')
            .populate('userId', 'fullName email phoneNumber');

        const total = await Booking.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving bookings'
        });
    }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: 'Invalid booking ID'
            });
        }

        const booking = await Booking.findById(id)
            .populate('courtId')
            .populate('userId', 'fullName email phoneNumber');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // check ownership
        if (req.userRole !== 'Admin' && booking.userId._id.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving booking'
        });
    }
};

/**
 * @desc    Update a booking (status, cancellation info, notes)
 * @route   PUT /api/bookings/:id
 * @access  Private
 */
const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // only owner or admin
        if (req.userRole !== 'Admin' && booking.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this booking'
            });
        }

        // prevent certain fields
        delete updateData.userId;
        delete updateData.courtId;
        delete updateData.totalPrice;

        // if cancelling, set cancellation metadata
        if (updateData.status === 'Cancelled') {
            updateData.cancelledAt = new Date();
            updateData.cancelledBy = req.userId;
            if (!updateData.cancellationReason) {
                updateData.cancellationReason = 'No reason provided';
            }
        }

        const updated = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: updated
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating booking'
        });
    }
};

/**
 * @desc    Delete a booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (req.userRole !== 'Admin' && booking.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this booking'
            });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting booking'
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
};
