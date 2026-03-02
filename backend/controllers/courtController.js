const Court = require('../models/Court');

/**
 * @desc    Create a new court
 * @route   POST /api/courts
 * @access  Private
 */
const createCourt = async (req, res, next) => {
    try {
        const { name, description, sportType, location, pricePerHour, capacity, amenities, operatingHours, availableDays, images, currency } = req.body;

        // Validate required fields
        if (!name || !description || !sportType || !location || !pricePerHour || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create court object
        const courtData = {
            name,
            description,
            sportType,
            location,
            pricePerHour,
            capacity,
            ownerId: req.userId,
            amenities: amenities || [],
            currency: currency || 'EGP',
            images: images || [],
            operatingHours: operatingHours || { start: '06:00', end: '23:00' },
            availableDays: availableDays || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        };

        const court = await Court.create(courtData);

        res.status(201).json({
            success: true,
            message: 'Court created successfully',
            data: court
        });
    } catch (error) {
        // Handle validation errors
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
            message: error.message || 'Error creating court'
        });
    }
};

/**
 * @desc    Get all courts with filters and pagination
 * @route   GET /api/courts
 * @access  Public
 */
const getAllCourts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sportType, city, sortBy = '-createdAt' } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (sportType) {
            filter.sportType = sportType;
        }

        if (city) {
            filter['location.city'] = new RegExp(city, 'i'); // Case-insensitive search
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination and sorting
        const courts = await Court.find(filter)
            .select('-__v')
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('ownerId', 'name email phone');

        // Get total count for pagination info
        const total = await Court.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: 'Courts retrieved successfully',
            data: courts,
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
            message: error.message || 'Error retrieving courts'
        });
    }
};

/**
 * @desc    Get a single court by ID
 * @route   GET /api/courts/:id
 * @access  Public
 */
const getCourtById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const court = await Court.findById(id)
            .populate('ownerId', 'name email phone profileImage');

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Court retrieved successfully',
            data: court
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Invalid court ID'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving court'
        });
    }
};

/**
 * @desc    Get courts by owner (current user)
 * @route   GET /api/courts/owner/my-courts
 * @access  Private
 */
const getMyCourts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const courts = await Court.find({ ownerId: req.userId })
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Court.countDocuments({ ownerId: req.userId });

        res.status(200).json({
            success: true,
            message: 'Your courts retrieved successfully',
            data: courts,
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
            message: error.message || 'Error retrieving courts'
        });
    }
};

/**
 * @desc    Update a court
 * @route   PUT /api/courts/:id
 * @access  Private
 */
const updateCourt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if court exists
        let court = await Court.findById(id);

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        // Check if user is the owner
        if (court.ownerId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this court'
            });
        }

        // Update court
        court = await Court.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Court updated successfully',
            data: court
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Invalid court ID'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error updating court'
        });
    }
};

/**
 * @desc    Delete a court
 * @route   DELETE /api/courts/:id
 * @access  Private
 */
const deleteCourt = async (req, res, next) => {
    try {
        const { id } = req.params;

        const court = await Court.findById(id);

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        // Check if user is the owner
        if (court.ownerId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this court'
            });
        }

        // Delete the court
        await Court.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Court deleted successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Invalid court ID'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting court'
        });
    }
};

/**
 * @desc    Search courts by name or description
 * @route   GET /api/courts/search/query
 * @access  Public
 */
const searchCourts = async (req, res, next) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query'
            });
        }

        const skip = (page - 1) * limit;

        const courts = await Court.find(
            { $text: { $search: q }, isActive: true },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('ownerId', 'name email phone');

        const total = await Court.countDocuments({ $text: { $search: q }, isActive: true });

        res.status(200).json({
            success: true,
            message: 'Search results',
            data: courts,
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
            message: error.message || 'Error searching courts'
        });
    }
};

/**
 * @desc    Get court statistics
 * @route   GET /api/courts/stats/analytics
 * @access  Private
 */
const getCourtStats = async (req, res, next) => {
    try {
        const stats = await Court.aggregate([
            {
                $match: { ownerId: require('mongoose').Types.ObjectId(req.userId) }
            },
            {
                $group: {
                    _id: null,
                    totalCourts: { $sum: 1 },
                    activeCourts: { $sum: { $cond: ['$isActive', 1, 0] } },
                    verifiedCourts: { $sum: { $cond: ['$isVerified', 1, 0] } },
                    averagePrice: { $avg: '$pricePerHour' },
                    totalBookings: { $sum: '$totalBookings' },
                    averageRating: { $avg: '$averageRating' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Court statistics retrieved',
            data: stats.length > 0 ? stats[0] : {
                totalCourts: 0,
                activeCourts: 0,
                verifiedCourts: 0,
                averagePrice: 0,
                totalBookings: 0,
                averageRating: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving statistics'
        });
    }
};

module.exports = {
    createCourt,
    getAllCourts,
    getCourtById,
    getMyCourts,
    updateCourt,
    deleteCourt,
    searchCourts,
    getCourtStats
};
