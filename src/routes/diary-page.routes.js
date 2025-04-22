const express = require('express');
const { body, query, param } = require('express-validator');
const diaryPageController = require('../controllers/diary-page.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/diary-pages:
 *   post:
 *     summary: Create a new diary page
 *     tags: [Diary Pages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diary_id
 *               - title
 *               - content
 *             properties:
 *               diary_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               skin_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Diary page created successfully
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
 *                   example: Diary page created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       $ref: '#/components/schemas/DiaryPage'
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
router.post(
  '/',
  authenticate,
  [
    body('diary_id').isInt().withMessage('Diary ID must be an integer'),
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('skin_id').optional().isInt().withMessage('Skin ID must be an integer')
  ],
  validate,
  diaryPageController.createDiaryPage
);

/**
 * @swagger
 * /api/diary-pages/diary/{diary_id}:
 *   get:
 *     summary: Get all pages for a diary
 *     tags: [Diary Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diary_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary ID
 *     responses:
 *       200:
 *         description: List of diary pages
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
 *                     pages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DiaryPage'
 *                     count:
 *                       type: integer
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
  '/diary/:diary_id',
  authenticate,
  [
    param('diary_id').isInt().withMessage('Diary ID must be an integer')
  ],
  validate,
  diaryPageController.getAllDiaryPages
);

/**
 * @swagger
 * /api/diary-pages/{id}:
 *   get:
 *     summary: Get a diary page by ID
 *     tags: [Diary Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary Page ID
 *     responses:
 *       200:
 *         description: Diary page details
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
 *                     page:
 *                       $ref: '#/components/schemas/DiaryPage'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary page not found
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
  diaryPageController.getDiaryPageById
);

/**
 * @swagger
 * /api/diary-pages/{id}:
 *   put:
 *     summary: Update a diary page
 *     tags: [Diary Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary Page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               skin_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Diary page updated successfully
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
 *                   example: Diary page updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       $ref: '#/components/schemas/DiaryPage'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary page not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('skin_id').optional().isInt().withMessage('Skin ID must be an integer')
  ],
  validate,
  diaryPageController.updateDiaryPage
);

/**
 * @swagger
 * /api/diary-pages/{id}:
 *   delete:
 *     summary: Delete a diary page
 *     tags: [Diary Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Diary Page ID
 *     responses:
 *       200:
 *         description: Diary page deleted successfully
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
 *                   example: Diary page deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary page not found
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
  diaryPageController.deleteDiaryPage
);

module.exports = router;
