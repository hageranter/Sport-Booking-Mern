const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notificationSocket');

// helper to build filter from query params
function buildFilter(query, currentUser, currentRole) {
    const { isRead, category, userId } = query;
    const filter = {};

    if (currentRole !== 'Admin') {
        // normal users only see their own notifications
        filter.userId = mongoose.Types.ObjectId(currentUser);
    } else if (userId) {
        filter.userId = mongoose.Types.ObjectId(userId);
    }

    if (typeof isRead !== 'undefined') {
        filter.isRead = isRead === 'true' || isRead === true;
    }

    if (category) {
        filter.category = category;
    }

    return filter;
}

/**
 * @desc    Create a new notification (typically system/admin)
 * @route   POST /api/notifications
 * @access  Private (admin)
 */
const createNotification = async (req, res) => {
    try {
        const data = req.body;

        // require minimum fields
        if (!data.userId || !data.category || !data.title || !data.message) {
            return res.status(400).json({
                success: false,
                message: 'userId, category, title and message are required'
            });
        }

        const notification = new Notification(data);
        await notification.save();

        // emit over websocket if user is connected
        sendNotification(notification.userId.toString(), notification);

        res.status(201).json({
            success: true,
            message: 'Notification created',
            data: notification
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
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get notifications (for current user or admin with filters)
 * @route   GET /api/notifications
 * @access  Private
 */
const getAllNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
        const filter = buildFilter(req.query, req.userId, req.userRole);

        const skip = (page - 1) * limit;

        const notifications = await Notification.find(filter)
            .sort(sort)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: 'Notifications retrieved',
            data: notifications,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get single notification by ID
 * @route   GET /api/notifications/:id
 * @access  Private
 */
const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Invalid ID' });
        }

        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (req.userRole !== 'Admin' && notification.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update notification (fields except userId)
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        delete updateData.userId; // cannot change owner

        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (req.userRole !== 'Admin' && notification.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        Object.assign(notification, updateData);
        await notification.save();

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        if (req.userRole !== 'Admin' && notification.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await notification.markAsRead();
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private (admin)
 */
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        if (req.userRole !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await notification.remove();
        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    markAsRead,
    deleteNotification
};