const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @openapi
 * /api/courts:
 *   post:
 *     tags:
 *       - Courts
 *     summary: Create a new court
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
 *               sportType:
 *                 type: string
 *                 enum: [Football, Tennis, Basketball, Paddle]
 *               location:
 *                 type: object
 *               pricePerHour:
 *                 type: number
 *               capacity:
 *                 type: number
 *             required: [name, description, sportType, location, pricePerHour, capacity]
 *     responses:
 *       '201':
 *         description: Court created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - Courts
 *     summary: Get all courts with filters
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
 *         name: sportType
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Courts retrieved successfully
 */
router.post('/', authMiddleware, courtController.createCourt);
router.get('/', courtController.getAllCourts);

/**
 * @openapi
 * /api/courts/search/query:
 *   get:
 *     tags:
 *       - Courts
 *     summary: Search courts by query
 *     parameters:
 *       - in: query
 *         name: q
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
 *         description: Search results
 */
router.get('/search/query', courtController.searchCourts);

/**
 * @openapi
 * /api/courts/owner/my-courts:
 *   get:
 *     tags:
 *       - Courts
 *     summary: Get current user's courts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User's courts retrieved successfully
 *       '401':
 *         description: Unauthorized
 */
router.get('/owner/my-courts', authMiddleware, courtController.getMyCourts);

/**
 * @openapi
 * /api/courts/stats/analytics:
 *   get:
 *     tags:
 *       - Courts
 *     summary: Get court statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Court statistics
 *       '401':
 *         description: Unauthorized
 */
router.get('/stats/analytics', authMiddleware, courtController.getCourtStats);

/**
 * @openapi
 * /api/courts/{id}:
 *   get:
 *     tags:
 *       - Courts
 *     summary: Get court by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Court retrieved successfully
 *       '404':
 *         description: Court not found
 *   put:
 *     tags:
 *       - Courts
 *     summary: Update court
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
 *         description: Court updated successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Court not found
 *   delete:
 *     tags:
 *       - Courts
 *     summary: Delete court
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
 *         description: Court deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Court not found
 */
router.get('/:id', courtController.getCourtById);
router.put('/:id', authMiddleware, courtController.updateCourt);
router.delete('/:id', authMiddleware, courtController.deleteCourt);

module.exports = router;
