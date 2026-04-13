const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @openapi
 * /api/matches:
 *   post:
 *     tags:
 *       - Matches
 *     summary: Create a new match
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               matchType:
 *                 type: string
 *                 enum: [Public, Private]
 *               capacity:
 *                 type: number
 *               notes:
 *                 type: string
 *             required: [bookingId, capacity]
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *   get:
 *     tags:
 *       - Matches
 *     summary: List matches
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
 *         name: matchType
 *         schema:
 *           type: string
 *       - in: query
 *         name: organizerId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 */
router.post('/', authMiddleware, matchController.createMatch);
router.get('/', authMiddleware, matchController.getAllMatches);

/**
 * @openapi
 * /api/matches/{id}:
 *   get:
 *     tags:
 *       - Matches
 *     summary: Get match by ID or invite code
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *       '404':
 *         description: Not found
 *   put:
 *     tags:
 *       - Matches
 *     summary: Update match
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
 *         description: Updated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *   delete:
 *     tags:
 *       - Matches
 *     summary: Delete match
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
 *         description: Deleted
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get('/:id', authMiddleware, matchController.getMatchById);
router.put('/:id', authMiddleware, matchController.updateMatch);
router.delete('/:id', authMiddleware, matchController.deleteMatch);

/**
 * @openapi
 * /api/matches/{id}/join:
 *   post:
 *     tags:
 *       - Matches
 *     summary: Join a match
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
 *         description: Joined
 *       '404':
 *         description: Not found
 *       '400':
 *         description: Bad request
 */
router.post('/:id/join', authMiddleware, matchController.joinMatch);

/**
 * @openapi
 * /api/matches/{id}/leave:
 *   post:
 *     tags:
 *       - Matches
 *     summary: Leave a match
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
 *         description: Left match
 *       '404':
 *         description: Not found
 *       '400':
 *         description: Bad request
 */
router.post('/:id/leave', authMiddleware, matchController.leaveMatch);

module.exports = router;