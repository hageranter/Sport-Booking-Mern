const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courtId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               totalPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *               notes:
 *                 type: string
 *             required: [courtId, startTime, endTime, totalPrice]
 *     responses:
 *       '201':
 *         description: Booking created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get all bookings (own for user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: courtId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Bookings retrieved successfully
 */
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getAllBookings);

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get booking by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Booking retrieved successfully
 *       '404':
 *         description: Booking not found
 *   put:
 *     tags:
 *       - Bookings
 *     summary: Update booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Booking updated successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Booking not found
 *   delete:
 *     tags:
 *       - Bookings
 *     summary: Delete booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Booking deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Booking not found
 */
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.put('/:id', authMiddleware, bookingController.updateBooking);
router.delete('/:id', authMiddleware, bookingController.deleteBooking);

module.exports = router;