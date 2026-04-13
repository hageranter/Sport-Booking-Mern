const Owner = require('../models/Owner');
const User = require('../models/User');
const Court = require('../models/Court');
const mongoose = require('mongoose');

/**
 * @desc    Register as a court owner
 * @route   POST /api/owners/register
 * @access  Private (User with CourtOwner role)
 */
const registerOwner = async (req, res) => {
    try {
        const { businessName, businessRegistration, taxId, location, contactPersons } = req.body;

        // Validate required fields
        if (!businessName || !businessRegistration) {
            return res.status(400).json({
                success: false,
                message: 'Business name and registration are required'
            });
        }

        // Check if owner already exists
        const existingOwner = await Owner.findOne({ userId: req.userId });
        if (existingOwner) {
            return res.status(400).json({
                success: false,
                message: 'User already registered as an owner'
            });
        }

        // Check if business registration is unique
        const existingBusiness = await Owner.findOne({ businessRegistration });
        if (existingBusiness) {
            return res.status(400).json({
                success: false,
                message: 'Business registration already exists'
            });
        }

        // Create owner profile
        const owner = new Owner({
            userId: req.userId,
            businessName,
            businessRegistration,
            taxId: taxId || null,
            location: location || {},
            contactPersons: contactPersons || [],
            approvalStatus: 'Pending'
        });

        await owner.save();

        // Update user role
        await User.findByIdAndUpdate(req.userId, { role: 'CourtOwner' });

        res.status(201).json({
            success: true,
            message: 'Owner registration submitted for approval',
            data: owner
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Business registration or email already exists'
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
            message: error.message || 'Error registering owner'
        });
    }
};

/**
 * @desc    Get all owners (Admin only)
 * @route   GET /api/owners
 * @access  Private (Admin)
 */
const getAllOwners = async (req, res) => {
    try {
        const { page = 1, limit = 10, approvalStatus, isActive } = req.query;
        const filter = {};

        if (approvalStatus) {
            filter.approvalStatus = approvalStatus;
        }
        if (typeof isActive !== 'undefined') {
            filter.isActive = isActive === 'true';
        }

        const skip = (page - 1) * limit;

        const owners = await Owner.find(filter)
            .populate('userId', 'fullName email phoneNumber')
            .populate('courts', 'name sportType')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Owner.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: 'Owners retrieved successfully',
            data: owners,
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
            message: error.message || 'Error retrieving owners'
        });
    }
};

/**
 * @desc    Get owner by ID
 * @route   GET /api/owners/:id
 * @access  Private
 */
const getOwnerById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: 'Invalid owner ID'
            });
        }

        const owner = await Owner.findById(id)
            .populate('userId', 'fullName email phoneNumber profilePicture')
            .populate('courts', 'name sportType location pricePerHour')
            .populate('approvedBy', 'fullName email');

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Owner retrieved successfully',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving owner'
        });
    }
};

/**
 * @desc    Get current user's owner profile
 * @route   GET /api/owners/me
 * @access  Private (CourtOwner)
 */
const getMyOwnerProfile = async (req, res) => {
    try {
        const owner = await Owner.findOne({ userId: req.userId })
            .populate('userId', 'fullName email phoneNumber profilePicture')
            .populate('courts')
            .populate('approvedBy', 'fullName');

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Owner profile retrieved',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving owner profile'
        });
    }
};

/**
 * @desc    Update owner profile
 * @route   PUT /api/owners/:id
 * @access  Private (owner or admin)
 */
const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        // Check authorization
        if (req.userRole !== 'Admin' && owner.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this owner'
            });
        }

        // Prevent certain fields from being updated
        delete updateData.userId;
        delete updateData.courts;
        delete updateData.totalCourts;
        delete updateData.totalBookings;
        delete updateData.totalRevenue;
        delete updateData.approvalStatus;
        delete updateData.approvedAt;
        delete updateData.approvedBy;

        Object.assign(owner, updateData);
        await owner.save();

        res.status(200).json({
            success: true,
            message: 'Owner profile updated successfully',
            data: owner
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Business registration already exists'
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
            message: error.message || 'Error updating owner'
        });
    }
};

/**
 * @desc    Approve owner application (Admin only)
 * @route   PATCH /api/owners/:id/approve
 * @access  Private (Admin)
 */
const approveOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        await owner.approveBusiness(req.userId);

        res.status(200).json({
            success: true,
            message: 'Owner approved successfully',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error approving owner'
        });
    }
};

/**
 * @desc    Reject owner application (Admin only)
 * @route   PATCH /api/owners/:id/reject
 * @access  Private (Admin)
 */
const rejectOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        await owner.rejectBusiness(req.userId, reason);

        res.status(200).json({
            success: true,
            message: 'Owner rejected successfully',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error rejecting owner'
        });
    }
};

/**
 * @desc    Suspend owner account (Admin only)
 * @route   PATCH /api/owners/:id/suspend
 * @access  Private (Admin)
 */
const suspendOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Suspension reason is required'
            });
        }

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        await owner.suspend(reason);

        res.status(200).json({
            success: true,
            message: 'Owner suspended successfully',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error suspending owner'
        });
    }
};

/**
 * @desc    Unsuspend owner account (Admin only)
 * @route   PATCH /api/owners/:id/unsuspend
 * @access  Private (Admin)
 */
const unsuspendOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        await owner.unsuspend();

        res.status(200).json({
            success: true,
            message: 'Owner unsuspended successfully',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error unsuspending owner'
        });
    }
};

/**
 * @desc    Get owner dashboard analytics
 * @route   GET /api/owners/:id/analytics
 * @access  Private (owner or admin)
 */
const getOwnerAnalytics = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        // Get booking data for owner's courts
        const bookings = await Court.find({ _id: { $in: owner.courts } });

        const analytics = {
            totalCourts: owner.totalCourts,
            totalBookings: owner.totalBookings,
            totalRevenue: owner.totalRevenue,
            averageRating: owner.averageRating,
            pendingBalance: owner.paymentSettings.pendingBalance,
            courts: bookings.map(court => ({
                id: court._id,
                name: court.name,
                sportType: court.sportType
            })),
            monthlyRevenue: owner.stats.monthlyRevenue,
            weeklyBookings: owner.stats.weeklyBookings,
            topCourts: owner.stats.topCourts,
            peakHours: owner.stats.peakHours
        };

        res.status(200).json({
            success: true,
            message: 'Analytics retrieved successfully',
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving analytics'
        });
    }
};

/**
 * @desc    Update bank details
 * @route   PATCH /api/owners/:id/bank-details
 * @access  Private (owner)
 */
const updateBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountHolderName, accountNumber, bankName, routingNumber, currency } = req.body;

        if (!accountHolderName || !accountNumber || !bankName) {
            return res.status(400).json({
                success: false,
                message: 'Account holder name, account number, and bank name are required'
            });
        }

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        if (owner.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update bank details'
            });
        }

        owner.bankDetails = {
            accountHolderName,
            accountNumber,
            bankName,
            routingNumber: routingNumber || null,
            currency: currency || 'EGP',
            isVerified: false
        };

        await owner.save();

        res.status(200).json({
            success: true,
            message: 'Bank details updated. Pending verification.',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating bank details'
        });
    }
};

/**
 * @desc    Delete owner profile (Admin only)
 * @route   DELETE /api/owners/:id
 * @access  Private (Admin)
 */
const deleteOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findByIdAndDelete(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        // Update user role back to User
        if (owner.userId) {
            await User.findByIdAndUpdate(owner.userId, { role: 'User' });
        }

        res.status(200).json({
            success: true,
            message: 'Owner deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting owner'
        });
    }
};

module.exports = {
    registerOwner,
    getAllOwners,
    getOwnerById,
    getMyOwnerProfile,
    updateOwner,
    approveOwner,
    rejectOwner,
    suspendOwner,
    unsuspendOwner,
    getOwnerAnalytics,
    updateBankDetails,
    deleteOwner
};
