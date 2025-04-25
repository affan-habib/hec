const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const awardController = require('../controllers/award.controller');
const { body, param, query, validationResult } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

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
 *                 description: Name of the award
 *               description:
 *                 type: string
 *                 description: Description of the award
 *               category:
 *                 type: string
 *                 description: Category of the award (e.g., Achievement, Milestone, Participation)
 *               image_url:
 *                 type: string
 *                 description: URL to the award image
 *               points:
 *                 type: integer
 *                 description: Points value of the award
 *     responses:
 *       201:
 *         description: Award created successfully
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
 *                   example: "Award created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Perfect Attendance"
 *                     description:
 *                       type: string
 *                       example: "Awarded for attending all scheduled classes in a month without any absences."
 *                     category:
 *                       type: string
 *                       example: "Achievement"
 *                     image_url:
 *                       type: string
 *                       example: "https://example.com/awards/perfect-attendance.png"
 *                     points:
 *                       type: integer
 *                       example: 100
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/',
  authenticate,
  isAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
    body('category').optional(),
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('points').optional().isInt({ min: 0 }).withMessage('Points must be a non-negative integer')
  ],
  validate,
  awardController.createAward
);

/**
 * @swagger
 * /api/awards:
 *   get:
 *     summary: Get all awards
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter awards by name (partial match)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter awards by category
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, points, created_at]
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of awards
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
 *                     awards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Perfect Attendance"
 *                           description:
 *                             type: string
 *                             example: "Awarded for attending all scheduled classes in a month without any absences."
 *                           category:
 *                             type: string
 *                             example: "Achievement"
 *                           image_url:
 *                             type: string
 *                             example: "https://example.com/awards/perfect-attendance.png"
 *                           points:
 *                             type: integer
 *                             example: 100
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 15
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/',
  authenticate,
  [
    query('page').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('name').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Name must be a string'),
    query('category').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Category must be a string'),
    query('sort_by').optional({ nullable: true, checkFalsy: true }).isIn(['name', 'points', 'created_at']).withMessage('Sort by must be one of: name, points, created_at'),
    query('sort_order').optional({ nullable: true, checkFalsy: true }).isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
  ],
  validate,
  awardController.getAllAwards
);

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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Perfect Attendance"
 *                     description:
 *                       type: string
 *                       example: "Awarded for attending all scheduled classes in a month without any absences."
 *                     category:
 *                       type: string
 *                       example: "Achievement"
 *                     image_url:
 *                       type: string
 *                       example: "https://example.com/awards/perfect-attendance.png"
 *                     points:
 *                       type: integer
 *                       example: 100
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Award not found
 *       500:
 *         description: Server error
 */
router.get('/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Award ID must be an integer')
  ],
  validate,
  awardController.getAwardById
);

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
 *                 description: Name of the award
 *               description:
 *                 type: string
 *                 description: Description of the award
 *               category:
 *                 type: string
 *                 description: Category of the award (e.g., Achievement, Milestone, Participation)
 *               image_url:
 *                 type: string
 *                 description: URL to the award image
 *               points:
 *                 type: integer
 *                 description: Points value of the award
 *     responses:
 *       200:
 *         description: Award updated successfully
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
 *                   example: "Award updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Perfect Attendance"
 *                     description:
 *                       type: string
 *                       example: "Awarded for attending all scheduled classes in a month without any absences."
 *                     category:
 *                       type: string
 *                       example: "Achievement"
 *                     image_url:
 *                       type: string
 *                       example: "https://example.com/awards/perfect-attendance.png"
 *                     points:
 *                       type: integer
 *                       example: 100
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
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
router.put('/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('Award ID must be an integer'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('category').optional().isString().withMessage('Category must be a string'),
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('points').optional().isInt({ min: 0 }).withMessage('Points must be a non-negative integer')
  ],
  validate,
  awardController.updateAward
);

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
 *                   example: "Award deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Award not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('Award ID must be an integer')
  ],
  validate,
  awardController.deleteAward
);

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
 *                 description: ID of the user to receive the award
 *               award_id:
 *                 type: integer
 *                 description: ID of the award to assign
 *     responses:
 *       201:
 *         description: Award assigned successfully
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
 *                   example: "Award granted to user successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     award_id:
 *                       type: integer
 *                       example: 1
 *                     awarded_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input or user already has this award
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or award not found
 *       500:
 *         description: Server error
 */
router.post('/assign',
  authenticate,
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('award_id').isInt().withMessage('Award ID must be an integer')
  ],
  validate,
  awardController.awardUser
);

/**
 * @swagger
 * /api/awards/user/{user_id}:
 *   get:
 *     summary: Get all awards for a user
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of user awards
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
 *                     userAwards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             example: 1
 *                           award_id:
 *                             type: integer
 *                             example: 1
 *                           awarded_at:
 *                             type: string
 *                             format: date-time
 *                           award:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Perfect Attendance"
 *                               description:
 *                                 type: string
 *                                 example: "Awarded for attending all scheduled classes in a month without any absences."
 *                               category:
 *                                 type: string
 *                                 example: "Achievement"
 *                               image_url:
 *                                 type: string
 *                                 example: "https://example.com/awards/perfect-attendance.png"
 *                               points:
 *                                 type: integer
 *                                 example: 100
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 5
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                         hasNextPage:
 *                           type: boolean
 *                           example: false
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:user_id',
  authenticate,
  [
    param('user_id').isInt().withMessage('User ID must be an integer'),
    query('page').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  validate,
  awardController.getUserAwards
);

module.exports = router;
