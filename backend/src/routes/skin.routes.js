const express = require('express');
const { body, query, param } = require('express-validator');
const skinController = require('../controllers/skin.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/skins:
 *   post:
 *     summary: Create a new skin
 *     tags: [Skins]
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
 *               - theme_data
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               theme_data:
 *                 type: object
 *               is_public:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Skin created successfully
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
 *                   example: Skin created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     skin:
 *                       $ref: '#/components/schemas/Skin'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('theme_data').notEmpty().withMessage('Theme data is required'),
    body('is_public').optional().isBoolean().withMessage('Is public must be a boolean')
  ],
  validate,
  skinController.createSkin
);

/**
 * @swagger
 * /api/skins:
 *   get:
 *     summary: Get all skins
 *     tags: [Skins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: public_only
 *         schema:
 *           type: boolean
 *         description: Filter by public skins only
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
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
 *         description: List of skins
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
 *                     skins:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Skin'
 *                     count:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
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
    query('public_only')
      .optional()
      .custom(value => {
        if (value === undefined || value === '') return true;
        if (value === 'true' || value === 'false' || value === true || value === false) return true;
        return false;
      })
      .withMessage('Public only must be a boolean'),
    query('user_id')
      .optional()
      .custom(value => {
        if (value === undefined || value === '') return true;
        return !isNaN(parseInt(value));
      })
      .withMessage('User ID must be an integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  validate,
  skinController.getAllSkins
);

/**
 * @swagger
 * /api/skins/{id}:
 *   get:
 *     summary: Get a skin by ID
 *     tags: [Skins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skin ID
 *     responses:
 *       200:
 *         description: Skin details
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
 *                     skin:
 *                       $ref: '#/components/schemas/Skin'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Skin not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  skinController.getSkinById
);

/**
 * @swagger
 * /api/skins/{id}:
 *   put:
 *     summary: Update a skin
 *     tags: [Skins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skin ID
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
 *               theme_data:
 *                 type: object
 *               is_public:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Skin updated successfully
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
 *                   example: Skin updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     skin:
 *                       $ref: '#/components/schemas/Skin'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Skin not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('theme_data').optional().notEmpty().withMessage('Theme data cannot be empty'),
    body('is_public').optional().isBoolean().withMessage('Is public must be a boolean')
  ],
  validate,
  skinController.updateSkin
);

/**
 * @swagger
 * /api/skins/{id}:
 *   delete:
 *     summary: Delete a skin
 *     tags: [Skins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skin ID
 *     responses:
 *       200:
 *         description: Skin deleted successfully
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
 *                   example: Skin deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Skin not found
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
  skinController.deleteSkin
);

module.exports = router;
