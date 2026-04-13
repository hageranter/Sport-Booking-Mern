const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

/**
 * Create a new payment
 */
const createPayment = async (req, res) => {
    try {
        const { bookingId, amount, currency, paymentMethod } = req.body;

        if (!bookingId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'bookingId and amount are required'
            });
        }

        // Verify booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const payment = await Payment.create({
            bookingId,
            userId: req.userId,
            amount,
            currency: currency || 'EGP',
            paymentMethod: paymentMethod || 'Stripe'
        });

        res.status(201).json({
            success: true,
            message: 'Payment created',
            data: payment
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
        }
        res.status(500).json({ success: false, message: error.message || 'Error creating payment' });
    }
};

/**
 * Get all payments (users see own, admins see all)
 */
const getAllPayments = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, userId } = req.query;
        const filter = {};

        // Non-admin users can only see their own payments
        if (req.userRole !== 'Admin') {
            filter.userId = req.userId;
        } else if (userId) {
            filter.userId = mongoose.Types.ObjectId(userId);
        }

        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;
        const payments = await Payment.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .populate('bookingId')
            .populate('userId', 'fullName email');

        const total = await Payment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: payments,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching payments' });
    }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Invalid payment ID' });
        }

        const payment = await Payment.findById(id)
            .populate('bookingId')
            .populate('userId', 'fullName email phoneNumber');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Check ownership
        if (req.userRole !== 'Admin' && payment.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching payment' });
    }
};

/**
 * Update payment (mainly for status changes and refunds)
 */
const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Only admin can update payments
        if (req.userRole !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        // Prevent altering key fields
        delete updateData.userId;
        delete updateData.bookingId;
        delete updateData.amount;
        delete updateData.currency;

        // Handle refund logic
        if (updateData.status === 'Refunded' && payment.status !== 'Refunded') {
            updateData.refundedAt = new Date();
            if (!updateData.refundAmount) {
                updateData.refundAmount = payment.amount;
            }
        }

        Object.assign(payment, updateData);
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment updated',
            data: payment
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
        }
        res.status(500).json({ success: false, message: error.message || 'Error updating payment' });
    }
};

/**
 * Delete payment (only unpaid payments can be deleted)
 */
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (payment.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending payments can be deleted'
            });
        }

        // Only admin or owner can delete
        if (req.userRole !== 'Admin' && payment.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        await Payment.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting payment' });
    }
};

/**
 * Mark payment as completed
 */
const completePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { stripePaymentIntentId } = req.body;

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (payment.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending payments can be completed'
            });
        }

        payment.status = 'Completed';
        payment.stripePaymentIntentId = stripePaymentIntentId || payment.stripePaymentIntentId;
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment completed',
            data: payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error completing payment' });
    }
};

/**
 * Mark payment as failed
 */
const failPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { failureReason } = req.body;

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (payment.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending payments can fail'
            });
        }

        payment.status = 'Failed';
        payment.failureReason = failureReason || 'Payment failed';
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment marked as failed',
            data: payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error failing payment' });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    completePayment,
    failPayment
};
