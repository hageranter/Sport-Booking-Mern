const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/auth');
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  completePayment,
  failPayment
} = require('../controllers/paymentController');

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     description: Create a pending payment for a booking
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - amount
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 150.50
 *               currency:
 *                 type: string
 *                 default: "EGP"
 *                 example: "EGP"
 *               paymentMethod:
 *                 type: string
 *                 enum: ["Stripe", "PayPal", "ApplePay", "GooglePay"]
 *                 default: "Stripe"
 *                 example: "Stripe"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or missing fields
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createPayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     description: Retrieve all payments (admin sees all, users see their own)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["Pending", "Completed", "Failed", "Refunded"]
 *         description: Filter by payment status
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID (admin only)
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getAllPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     description: Retrieve details of a specific payment
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, getPaymentById);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment
 *     description: Update payment status or refund details (admin only)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Completed", "Failed", "Refunded"]
 *                 example: "Completed"
 *               refundAmount:
 *                 type: number
 *                 example: 150.50
 *               failureReason:
 *                 type: string
 *                 example: "Insufficient funds"
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       403:
 *         description: Permission denied (admin only)
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, requireRole('Admin'), updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete payment
 *     description: Delete a pending payment (only pending payments can be deleted)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete non-pending payment
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, deletePayment);

/**
 * @swagger
 * /api/payments/{id}/complete:
 *   post:
 *     summary: Mark payment as completed
 *     description: Mark a pending payment as successfully completed
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stripePaymentIntentId:
 *                 type: string
 *                 example: "pi_1234567890"
 *     responses:
 *       200:
 *         description: Payment marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Cannot complete non-pending payment
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post('/:id/complete', authMiddleware, completePayment);

/**
 * @swagger
 * /api/payments/{id}/fail:
 *   post:
 *     summary: Mark payment as failed
 *     description: Mark a pending payment as failed
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               failureReason:
 *                 type: string
 *                 example: "Card declined"
 *     responses:
 *       200:
 *         description: Payment marked as failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Cannot fail non-pending payment
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post('/:id/fail', authMiddleware, failPayment);

module.exports = router;
