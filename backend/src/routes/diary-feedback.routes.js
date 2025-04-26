const express = require('express');
const { body, param, query } = require('express-validator');
const diaryFeedbackController = require('../controllers/diary-feedback.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate, isTutor } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/diary-feedback:
 *   post:
 *     summary: Create or update feedback for a diary page
 *     description: |
 *       Creates or updates feedback for a diary page.
 *       Only tutors and admins can provide feedback.
 *     tags: [Diary Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diary_page_id
 *             properties:
 *               diary_page_id:
 *                 type: integer
 *                 description: ID of the diary page
 *               feedback:
 *                 type: string
 *                 description: Feedback text
 *               marks:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Marks given to the diary page (0-100)
 *     responses:
 *       201:
 *         description: Feedback created successfully
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
 *                   example: Feedback created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     feedback:
 *                       $ref: '#/components/schemas/DiaryFeedback'
 *       200:
 *         description: Feedback updated successfully
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
 *                   example: Feedback updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     feedback:
 *                       $ref: '#/components/schemas/DiaryFeedback'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary page not found
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticate,
  isTutor,
  [
    body('diary_page_id').isInt().withMessage('Diary page ID must be an integer'),
    body('feedback').optional().isString().withMessage('Feedback must be a string'),
    body('marks').optional().isInt({ min: 0, max: 100 }).withMessage('Marks must be an integer between 0 and 100')
  ],
  validate,
  diaryFeedbackController.createOrUpdateFeedback
);

/**
 * @swagger
 * /api/diary-feedback/page/{diary_page_id}:
 *   get:
 *     summary: Get feedback for a diary page
 *     description: |
 *       Retrieves feedback for a specific diary page.
 *       Users can only access feedback for diary pages they have permission to view.
 *     tags: [Diary Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diary_page_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the diary page
 *     responses:
 *       200:
 *         description: Feedback retrieved successfully
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
 *                     feedback:
 *                       $ref: '#/components/schemas/DiaryFeedback'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Diary page not found or no feedback found
 *       500:
 *         description: Server error
 */
router.get(
  '/page/:diary_page_id',
  authenticate,
  [
    param('diary_page_id').isInt().withMessage('Diary page ID must be an integer')
  ],
  validate,
  diaryFeedbackController.getFeedbackByPageId
);

/**
 * @swagger
 * /api/diary-feedback/tutor/{tutor_id}:
 *   get:
 *     summary: Get all feedback provided by a tutor
 *     description: |
 *       Retrieves all feedback provided by a specific tutor.
 *       Tutors can only access their own feedback, while admins can access any tutor's feedback.
 *     tags: [Diary Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tutor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tutor
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Feedback retrieved successfully
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
 *                     feedbacks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DiaryFeedback'
 *                     count:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tutor not found
 *       500:
 *         description: Server error
 */
router.get(
  '/tutor/:tutor_id',
  authenticate,
  [
    param('tutor_id').isInt().withMessage('Tutor ID must be an integer')
  ],
  validate,
  diaryFeedbackController.getFeedbackByTutorId
);

/**
 * @swagger
 * /api/diary-feedback/{id}:
 *   delete:
 *     summary: Delete feedback
 *     description: |
 *       Deletes feedback.
 *       Tutors can only delete their own feedback, while admins can delete any feedback.
 *     tags: [Diary Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feedback
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
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
 *                   example: Feedback deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Feedback ID must be an integer')
  ],
  validate,
  diaryFeedbackController.deleteFeedback
);

module.exports = router;
