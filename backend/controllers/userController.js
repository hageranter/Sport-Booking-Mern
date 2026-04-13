const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, isActive } = req.query;
        const filter = {};

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .select('-passwordHash -refreshTokens -passwordResetToken -passwordResetExpires')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching users' });
    }
};

/**
 * Create a new user (Admin only)
 */
const createUser = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, role, language, profilePicture, isActive } = req.body;

        if (!email || !password || !fullName || !phoneNumber) {
            return res.status(400).json({ success: false, message: 'email, password, fullName and phoneNumber are required' });
        }

        // Check uniqueness
        const existsEmail = await User.findOne({ email });
        if (existsEmail) return res.status(400).json({ success: false, message: 'Email already in use' });

        const existsPhone = await User.findOne({ phoneNumber });
        if (existsPhone) return res.status(400).json({ success: false, message: 'Phone number already in use' });

        const user = new User({
            email,
            passwordHash: password,
            fullName,
            phoneNumber,
            role: role || 'User',
            language: language || 'ar',
            profilePicture: profilePicture || null,
            isActive: typeof isActive === 'boolean' ? isActive : true
        });

        await user.save();

        const out = user.toJSON ? user.toJSON() : user;

        res.status(201).json({ success: true, message: 'User created', data: out });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
        }
        res.status(500).json({ success: false, message: error.message || 'Error creating user' });
    }
};

/**
 * Get user by ID (Auth required, users can only view own)
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(id)
            .select('-passwordHash -refreshTokens -passwordResetToken -passwordResetExpires');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // users can only view themselves unless admin
        if (req.userRole !== 'Admin' && req.userId.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching user' });
    }
};

/**
 * Update user profile (Auth required, users can only update own)
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // users can only update themselves
        if (req.userRole !== 'Admin' && req.userId.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        // prevent privilege escalation
        if (updateData.role && req.userRole !== 'Admin') {
            delete updateData.role;
        }
        delete updateData.passwordHash;
        delete updateData.refreshTokens;
        delete updateData.passwordResetToken;
        delete updateData.passwordResetExpires;
        delete updateData.isEmailVerified;
        delete updateData.isPhoneVerified;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // check email uniqueness if changed
        if (updateData.email && updateData.email !== user.email) {
            const exists = await User.findOne({ email: updateData.email });
            if (exists) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        // check phone uniqueness if changed
        if (updateData.phoneNumber && updateData.phoneNumber !== user.phoneNumber) {
            const exists = await User.findOne({ phoneNumber: updateData.phoneNumber });
            if (exists) {
                return res.status(400).json({ success: false, message: 'Phone number already in use' });
            }
        }

        Object.assign(user, updateData);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
        }
        res.status(500).json({ success: false, message: error.message || 'Error updating user' });
    }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting user' });
    }
};

/**
 * Change password (Auth required)
 */
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required' });
        }

        // users can only change their own password
        if (req.userId.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // set new password
        user.passwordHash = newPassword;
        user.refreshTokens = []; // clear all sessions after password change
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please login again.'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
        }
        res.status(500).json({ success: false, message: error.message || 'Error changing password' });
    }
};

/**
 * Get current user profile (Auth required)
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-passwordHash -refreshTokens -passwordResetToken -passwordResetExpires');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching current user' });
    }
};

/**
 * Update role (Admin only)
 */
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['User', 'CourtOwner', 'Admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User role updated',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating user role' });
    }
};

/**
 * Deactivate user (Admin only)
 */
const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User deactivated',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deactivating user' });
    }
};

/**
 * Activate user (Admin only)
 */
const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User activated',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error activating user' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
    getCurrentUser,
    updateUserRole,
    deactivateUser,
    activateUser
};
