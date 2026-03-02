const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (Admin only)
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
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get('/', authMiddleware, requireRole('Admin'), userController.getAllUsers);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [User, CourtOwner, Admin]
 *               language:
 *                 type: string
 *               profilePicture:
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
router.post('/', authMiddleware, requireRole('Admin'), userController.createUser);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, userController.getCurrentUser);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
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
 *       - Users
 *     summary: Update user profile
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               language:
 *                 type: string
 *               profilePicture:
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
 *       - Users
 *     summary: Delete user (Admin only)
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
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, requireRole('Admin'), userController.deleteUser);

/**
 * @openapi
 * /api/users/{id}/change-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Change user password
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
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required: [currentPassword, newPassword]
 *     responses:
 *       '200':
 *         description: Password changed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post('/:id/change-password', authMiddleware, userController.changePassword);

/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user role (Admin only)
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
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [User, CourtOwner, Admin]
 *             required: [role]
 *     responses:
 *       '200':
 *         description: Role updated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.patch('/:id/role', authMiddleware, requireRole('Admin'), userController.updateUserRole);

/**
 * @openapi
 * /api/users/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Deactivate user (Admin only)
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
 *         description: User deactivated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.patch('/:id/deactivate', authMiddleware, requireRole('Admin'), userController.deactivateUser);

/**
 * @openapi
 * /api/users/{id}/activate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Activate user (Admin only)
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
 *         description: User activated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.patch('/:id/activate', authMiddleware, requireRole('Admin'), userController.activateUser);

module.exports = router;
