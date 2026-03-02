const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get notifications (current user or admin with filters)
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
 *         name: isRead
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Admin only filter by userId
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get('/', authMiddleware, notificationController.getAllNotifications);

/**
 * @openapi
 * /api/notifications:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Create a notification (admin/system)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               category:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               relatedId:
 *                 type: string
 *               relatedModel:
 *                 type: string
 *               actionUrl:
 *                 type: string
 *               priority:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post('/', authMiddleware, requireRole('Admin'), notificationController.createNotification);

/**
 * @openapi
 * /api/notifications/{id}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get notification by ID
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
 *         description: OK
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Update notification
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
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               isRead:
 *                 type: boolean
 *               deliveryStatus:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Updated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete notification (admin only)
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
 *       '404':
 *         description: Not found
 */
router.get('/:id', authMiddleware, notificationController.getNotificationById);
router.put('/:id', authMiddleware, notificationController.updateNotification);
router.delete('/:id', authMiddleware, requireRole('Admin'), notificationController.deleteNotification);

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark notification as read
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
 *         description: OK
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 */
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

module.exports = router;