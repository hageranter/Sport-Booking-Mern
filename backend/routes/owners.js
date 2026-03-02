const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

/**
 * @openapi
 * /api/owners/register:
 *   post:
 *     tags:
 *       - Owners
 *     summary: Register as a court owner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               businessRegistration:
 *                 type: string
 *               taxId:
 *                 type: string
 *               location:
 *                 type: object
 *               contactPersons:
 *                 type: array
 *     responses:
 *       '201':
 *         description: Owner registered successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 */
router.post('/register', authMiddleware, ownerController.registerOwner);

/**
 * @openapi
 * /api/owners/me:
 *   get:
 *     tags:
 *       - Owners
 *     summary: Get current user's owner profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 */
router.get('/me', authMiddleware, ownerController.getMyOwnerProfile);

/**
 * @openapi
 * /api/owners:
 *   get:
 *     tags:
 *       - Owners
 *     summary: Get all owners (Admin only)
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
 *         name: approvalStatus
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
router.get('/', authMiddleware, requireRole('Admin'), ownerController.getAllOwners);

/**
 * @openapi
 * /api/owners/{id}:
 *   get:
 *     tags:
 *       - Owners
 *     summary: Get owner by ID
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
 *       '404':
 *         description: Not found
 *   put:
 *     tags:
 *       - Owners
 *     summary: Update owner profile
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
 *               businessName:
 *                 type: string
 *               location:
 *                 type: object
 *               contactPersons:
 *                 type: array
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
 *       - Owners
 *     summary: Delete owner (Admin only)
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
router.get('/:id', authMiddleware, ownerController.getOwnerById);
router.put('/:id', authMiddleware, ownerController.updateOwner);
router.delete('/:id', authMiddleware, requireRole('Admin'), ownerController.deleteOwner);

/**
 * @openapi
 * /api/owners/{id}/approve:
 *   patch:
 *     tags:
 *       - Owners
 *     summary: Approve owner application (Admin only)
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
 *         description: Approved
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 */
router.patch('/:id/approve', authMiddleware, requireRole('Admin'), ownerController.approveOwner);

/**
 * @openapi
 * /api/owners/{id}/reject:
 *   patch:
 *     tags:
 *       - Owners
 *     summary: Reject owner application (Admin only)
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
 *               reason:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Rejected
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 */
router.patch('/:id/reject', authMiddleware, requireRole('Admin'), ownerController.rejectOwner);

/**
 * @openapi
 * /api/owners/{id}/suspend:
 *   patch:
 *     tags:
 *       - Owners
 *     summary: Suspend owner account (Admin only)
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
 *               reason:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Suspended
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 */
router.patch('/:id/suspend', authMiddleware, requireRole('Admin'), ownerController.suspendOwner);

/**
 * @openapi
 * /api/owners/{id}/unsuspend:
 *   patch:
 *     tags:
 *       - Owners
 *     summary: Unsuspend owner account (Admin only)
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
 *         description: Unsuspended
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 */
router.patch('/:id/unsuspend', authMiddleware, requireRole('Admin'), ownerController.unsuspendOwner);

/**
 * @openapi
 * /api/owners/{id}/analytics:
 *   get:
 *     tags:
 *       - Owners
 *     summary: Get owner dashboard analytics
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
 *       '404':
 *         description: Not found
 */
router.get('/:id/analytics', authMiddleware, ownerController.getOwnerAnalytics);

/**
 * @openapi
 * /api/owners/{id}/bank-details:
 *   patch:
 *     tags:
 *       - Owners
 *     summary: Update bank details
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
 *               accountHolderName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               bankName:
 *                 type: string
 *               routingNumber:
 *                 type: string
 *               currency:
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
 */
router.patch('/:id/bank-details', authMiddleware, ownerController.updateBankDetails);

module.exports = router;
