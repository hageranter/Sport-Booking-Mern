const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @openapi
 * /api/tournaments:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Create a new tournament
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               sportTypeId:
 *                 type: string
 *               format:
 *                 type: string
 *                 enum: [SingleElimination, DoubleElimination, RoundRobin, GroupStage]
 *               tournamentType:
 *                 type: string
 *                 enum: [Public, Private, Invite-Only]
 *               maxParticipants:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               registrationDeadline:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               entryFee:
 *                 type: number
 *               prizePool:
 *                 type: object
 *                 properties:
 *                   firstPlace:
 *                     type: number
 *                   secondPlace:
 *                     type: number
 *                   thirdPlace:
 *                     type: number
 *               rules:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *             required: [name, sportTypeId, maxParticipants, startDate, registrationDeadline]
 *     responses:
 *       '201':
 *         description: Tournament created successfully
 *       '400':
 *         description: Bad request
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Get all tournaments
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
 *           enum: [Draft, Registration, InProgress, Completed, Cancelled]
 *       - in: query
 *         name: sportTypeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tournamentType
 *         schema:
 *           type: string
 *           enum: [Public, Private, Invite-Only]
 *     responses:
 *       '200':
 *         description: List of tournaments
 */
router.post('/', authMiddleware, tournamentController.createTournament);
router.get('/', tournamentController.getTournaments);

/**
 * @openapi
 * /api/tournaments/my-tournaments:
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Get tournaments organized by current user
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
 *     responses:
 *       '200':
 *         description: List of user's tournaments
 */
router.get('/my-tournaments', authMiddleware, tournamentController.getMyTournaments);

/**
 * @openapi
 * /api/tournaments/{id}:
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Get a specific tournament
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tournament details
 *       '404':
 *         description: Tournament not found
 *   patch:
 *     tags:
 *       - Tournaments
 *     summary: Update a tournament (organizer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Tournament updated successfully
 *       '403':
 *         description: Forbidden - not organizer
 *       '404':
 *         description: Tournament not found
 *   delete:
 *     tags:
 *       - Tournaments
 *     summary: Delete a tournament (organizer only)
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
 *         description: Tournament deleted successfully
 *       '403':
 *         description: Forbidden - not organizer
 *       '404':
 *         description: Tournament not found
 */
router.get('/:id', tournamentController.getTournamentById);
router.patch('/:id', authMiddleware, tournamentController.updateTournament);
router.delete('/:id', authMiddleware, tournamentController.deleteTournament);

/**
 * @openapi
 * /api/tournaments/{id}/register:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Register for a tournament
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *               inviteCode:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registered successfully
 *       '400':
 *         description: Bad request or tournament not accepting registrations
 *       '403':
 *         description: Invalid invite code
 */
router.post('/:id/register', authMiddleware, tournamentController.registerParticipant);

/**
 * @openapi
 * /api/tournaments/{id}/withdraw:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Withdraw from a tournament
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
 *         description: Withdrawn successfully
 *       '404':
 *         description: Tournament not found
 */
router.post('/:id/withdraw', authMiddleware, tournamentController.withdrawParticipant);

/**
 * @openapi
 * /api/tournaments/{id}/participants:
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Get participants of a tournament
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: List of participants
 *       '404':
 *         description: Tournament not found
 */
router.get('/:id/participants', tournamentController.getParticipants);

/**
 * @openapi
 * /api/tournaments/{id}/start:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Start a tournament (organizer only)
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
 *         description: Tournament started successfully
 *       '403':
 *         description: Forbidden - not organizer
 *       '404':
 *         description: Tournament not found
 */
router.post('/:id/start', authMiddleware, tournamentController.startTournament);

/**
 * @openapi
 * /api/tournaments/{id}/complete:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Complete a tournament (organizer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               winnerId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Tournament completed successfully
 *       '403':
 *         description: Forbidden - not organizer
 *       '404':
 *         description: Tournament not found
 */
router.post('/:id/complete', authMiddleware, tournamentController.completeTournament);

/**
 * @openapi
 * /api/tournaments/{id}/cancel:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Cancel a tournament (organizer only)
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
 *         description: Tournament cancelled successfully
 *       '403':
 *         description: Forbidden - not organizer
 *       '404':
 *         description: Tournament not found
 */
router.post('/:id/cancel', authMiddleware, tournamentController.cancelTournament);

module.exports = router;
