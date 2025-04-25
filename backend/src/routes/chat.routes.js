const express = require('express');
const { body, param, query } = require('express-validator');
const chatController = require('../controllers/chat.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chats]
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
 *               is_group:
 *                 type: boolean
 *               participants:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Chat created successfully
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
    body('name').if(body('is_group').equals(true)).notEmpty().withMessage('Name is required for group chats'),
    body('is_group').optional().isBoolean().withMessage('is_group must be a boolean'),
    body('participant_ids').isArray({ min: 1 }).withMessage('At least one participant ID is required'),
    body('participant_ids.*').isInt().withMessage('Participant IDs must be integers'),
    body('initial_message').optional().isString().withMessage('Initial message must be a string')
  ],
  validate,
  chatController.createChat
);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats for the current user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  chatController.getMyChats
);

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Get a chat by ID
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: Chat details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Chat ID must be an integer')
  ],
  validate,
  chatController.getChatById
);

/**
 * @swagger
 * /api/chats/{id}/messages:
 *   get:
 *     summary: Get messages for a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/messages',
  authenticate,
  [
    param('id').isInt().withMessage('Chat ID must be an integer'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  validate,
  chatController.getChatMessages
);

/**
 * @swagger
 * /api/chats/{id}/messages:
 *   post:
 *     summary: Send a message to a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/messages',
  authenticate,
  [
    param('id').isInt().withMessage('Chat ID must be an integer'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  validate,
  chatController.sendMessage
);

/**
 * @swagger
 * /api/chats/{id}/participants:
 *   post:
 *     summary: Add a participant to a chat
 *     description: |
 *       Adds a new participant to a group chat.
 *       User must be a participant in the chat or an admin.
 *       Only works for group chats.
 *
 *       ## Example Request
 *       ```json
 *       {
 *         "user_id": 5
 *       }
 *       ```
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *                 description: ID of the user to add as a participant
 *     responses:
 *       200:
 *         description: Participant added successfully
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
 *                   example: "Participant added successfully"
 *       400:
 *         description: Invalid input, user is already a participant, or cannot add to non-group chat
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - you are not a participant in this chat
 *       404:
 *         description: Chat or user not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/participants',
  authenticate,
  [
    param('id').isInt().withMessage('Chat ID must be an integer'),
    body('user_id').isInt().withMessage('User ID must be an integer')
  ],
  validate,
  chatController.addParticipant
);

/**
 * @swagger
 * /api/chats/{id}/participants/{user_id}:
 *   delete:
 *     summary: Remove a participant from a chat
 *     description: |
 *       Removes a participant from a group chat.
 *       Only the chat creator or an admin can remove participants.
 *       Cannot remove the chat creator (except by admin).
 *       Only works for group chats.
 *
 *       ## Example Request
 *       ```
 *       DELETE /api/chats/1/participants/5
 *       ```
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat ID
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to remove
 *     responses:
 *       200:
 *         description: Participant removed successfully
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
 *                   example: "Participant removed successfully"
 *       400:
 *         description: Invalid input, user is not a participant, or cannot remove from non-group chat
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only the chat creator or an admin can remove participants
 *       404:
 *         description: Chat or user not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id/participants/:user_id',
  authenticate,
  [
    param('id').isInt().withMessage('Chat ID must be an integer'),
    param('user_id').isInt().withMessage('User ID must be an integer')
  ],
  validate,
  chatController.removeParticipant
);

/**
 * @swagger
 * /api/chats/{id}/leave:
 *   post:
 *     summary: Leave a chat
 *     description: |
 *       Allows a user to leave a group chat.
 *       If the user is the creator, another participant will be assigned as the new creator.
 *       If the user is the last participant, the chat will be deleted.
 *       Only works for group chats.
 *
 *       ## Example Request
 *       ```
 *       POST /api/chats/1/leave
 *       ```
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: Successfully left the chat
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
 *                   example: "You have left the chat"
 *       400:
 *         description: Invalid input, you are not a participant, or cannot leave a non-group chat
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/leave',
  authenticate,
  [
    param('id').isInt().withMessage('Chat ID must be an integer')
  ],
  validate,
  chatController.leaveChat
);

module.exports = router;
