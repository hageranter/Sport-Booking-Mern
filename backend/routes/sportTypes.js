const express = require('express');
const router = express.Router();
const sportTypeController = require('../controllers/sportTypeController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

/**
 * @openapi
 * /api/sport-types:
 *   post:
 *     tags:
 *       - SportTypes
 *     summary: Create new sport type
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
 *               nameAr:
 *                 type: string
 *               description:
 *                 type: string
 *               descriptionAr:
 *                 type: string
 *               icon:
 *                 type: string
 *               minPlayers:
 *                 type: number
 *               maxPlayers:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *             required: [name, nameAr, minPlayers, maxPlayers]
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *   get:
 *     tags:
 *       - SportTypes
 *     summary: List sport types
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: OK
 */
router.post('/', authMiddleware, requireRole('Admin'), sportTypeController.createSportType);
router.get('/', sportTypeController.getAllSportTypes);

/**
 * @openapi
 * /api/sport-types/{id}:
 *   get:
 *     tags:
 *       - SportTypes
 *     summary: Get sport type by ID
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
 *       - SportTypes
 *     summary: Update sport type
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
 *       - SportTypes
 *     summary: Delete sport type
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
router.get('/:id', sportTypeController.getSportTypeById);
router.put('/:id', authMiddleware, requireRole('Admin'), sportTypeController.updateSportType);
router.delete('/:id', authMiddleware, requireRole('Admin'), sportTypeController.deleteSportType);

module.exports = router;
