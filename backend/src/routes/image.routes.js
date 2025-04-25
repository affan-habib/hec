const express = require('express');
const { param, query } = require('express-validator');
const imageController = require('../controllers/image.controller');
const { handleUploadErrors } = require('../middlewares/upload.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, jpeg, png, gif)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     image:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         filename:
 *                           type: string
 *                         original_name:
 *                           type: string
 *                         mime_type:
 *                           type: string
 *                         size:
 *                           type: integer
 *                         url:
 *                           type: string
 *                         uploaded_by:
 *                           type: integer
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid input or file type
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/upload', authenticate, handleUploadErrors, imageController.uploadImage);

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all images for the current user
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: List of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           filename:
 *                             type: string
 *                           original_name:
 *                             type: string
 *                           mime_type:
 *                             type: string
 *                           size:
 *                             type: integer
 *                           url:
 *                             type: string
 *                           uploaded_by:
 *                             type: integer
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  validate,
  imageController.getUserImages
);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  imageController.deleteImage
);

module.exports = router;
