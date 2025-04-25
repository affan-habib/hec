const express = require('express');
const { body, query, param } = require('express-validator');
const diaryController = require('../controllers/diary.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/diaries:
 *   post:
 *     summary: Create a new diary
 *     tags: [Diaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_public:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Diary created successfully
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
 *                   example: Diary created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     diary:
 *                       $ref: '#/components/schemas/Diary'
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
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('is_public').optional().isBoolean().withMessage('Is public must be a boolean')
  ],
  validate,
  diaryController.createDiary
);

/**
 * @swagger
 * /api/diaries:
 *   get:
 *     summary: Get all diaries
 *     tags: [Diaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: public_only
 *         schema:
 *           type: boolean
 *         description: Filter by public diaries only
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
 *         description: List of diaries
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
 *                     diaries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Diary'
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
    query('public_only').optional().isBoolean().withMessage('Public only must be a boolean'),
    query('user_id').optional().isInt().withMessage('User ID must be an integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  validate,
  diaryController.getAllDiaries
);

/**
 * @swagger
 * /api/diaries/{id}:
 *   get:
 *     summary: Get a diary by ID
 *     tags: [Diaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary ID
 *       - in: query
 *         name: include_pages
 *         schema:
 *           type: boolean
 *         description: Whether to include diary pages
 *     responses:
 *       200:
 *         description: Diary details
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
 *                     diary:
 *                       $ref: '#/components/schemas/Diary'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary not found
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
  diaryController.getDiaryById
);

/**
 * @swagger
 * /api/diaries/{id}:
 *   put:
 *     summary: Update a diary
 *     tags: [Diaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_public:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Diary updated successfully
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
 *                   example: Diary updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     diary:
 *                       $ref: '#/components/schemas/Diary'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('is_public').optional().isBoolean().withMessage('Is public must be a boolean')
  ],
  validate,
  diaryController.updateDiary
);

/**
 * @swagger
 * /api/diaries/{id}:
 *   delete:
 *     summary: Delete a diary
 *     tags: [Diaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary ID
 *     responses:
 *       200:
 *         description: Diary deleted successfully
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
 *                   example: Diary deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary not found
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
  diaryController.deleteDiary
);

module.exports = router;
