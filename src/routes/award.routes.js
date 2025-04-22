const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/awards:
 *   post:
 *     summary: Create a new award (admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *               points:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Award created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, isAdmin, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(201).json({
    success: true,
    message: 'This endpoint will create a new award (admin only)'
  });
});

/**
 * @swagger
 * /api/awards:
 *   get:
 *     summary: Get all awards
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of awards
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(200).json({
    success: true,
    message: 'This endpoint will return all awards'
  });
});

/**
 * @swagger
 * /api/awards/{id}:
 *   get:
 *     summary: Get an award by ID
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Award ID
 *     responses:
 *       200:
 *         description: Award details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Award not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(200).json({
    success: true,
    message: `This endpoint will return award with ID ${req.params.id}`
  });
});

/**
 * @swagger
 * /api/awards/{id}:
 *   put:
 *     summary: Update an award (admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Award ID
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
 *               image_url:
 *                 type: string
 *               points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Award updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Award not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, isAdmin, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(200).json({
    success: true,
    message: `This endpoint will update award with ID ${req.params.id} (admin only)`
  });
});

/**
 * @swagger
 * /api/awards/{id}:
 *   delete:
 *     summary: Delete an award (admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Award ID
 *     responses:
 *       200:
 *         description: Award deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Award not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(200).json({
    success: true,
    message: `This endpoint will delete award with ID ${req.params.id} (admin only)`
  });
});

/**
 * @swagger
 * /api/awards/assign:
 *   post:
 *     summary: Assign an award to a user (admin or tutor only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - award_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               award_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Award assigned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or award not found
 *       500:
 *         description: Server error
 */
router.post('/assign', authenticate, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(201).json({
    success: true,
    message: 'This endpoint will assign an award to a user (admin or tutor only)'
  });
});

/**
 * @swagger
 * /api/awards/user/{userId}:
 *   get:
 *     summary: Get all awards for a user
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user awards
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', authenticate, (req, res) => {
  // This is a placeholder. Implement the actual controller method.
  res.status(200).json({
    success: true,
    message: `This endpoint will return all awards for user with ID ${req.params.userId}`
  });
});

module.exports = router;
