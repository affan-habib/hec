const express = require('express');
const { body, param, query } = require('express-validator');
const tutorController = require('../controllers/tutor.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/tutors:
 *   get:
 *     summary: Get all tutors
 *     description: |
 *       Retrieves a list of all tutors with their profiles.
 *       Supports pagination, filtering, and sorting.
 *       
 *       ## Filtering Options
 *       - **name**: Filter by tutor's first or last name (partial match)
 *       - **specialization**: Filter by specialization area
 *       - **min_experience**: Filter by minimum years of experience
 *       - **max_hourly_rate**: Filter by maximum hourly rate
 *       
 *       ## Sorting Options
 *       - **sort_by**: Field to sort by (first_name, last_name, experience, hourly_rate)
 *       - **sort_order**: Sort order (ASC or DESC)
 *       
 *       ## Pagination
 *       - **page**: Page number (default: 1)
 *       - **limit**: Number of tutors per page (default: 10)
 *       
 *       ## Example Requests
 *       
 *       Basic request:
 *       ```
 *       GET /api/tutors
 *       ```
 *       
 *       With filtering:
 *       ```
 *       GET /api/tutors?name=John&specialization=Business%20English&min_experience=3&max_hourly_rate=30
 *       ```
 *       
 *       With sorting:
 *       ```
 *       GET /api/tutors?sort_by=hourly_rate&sort_order=ASC
 *       ```
 *       
 *       With pagination:
 *       ```
 *       GET /api/tutors?page=2&limit=5
 *       ```
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of tutors per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter tutors by first or last name (partial match)
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *           enum: [General English, Business English, Academic English, Conversation, Exam Preparation, Children's English]
 *         description: Filter tutors by specialization
 *       - in: query
 *         name: min_experience
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter tutors by minimum years of experience
 *       - in: query
 *         name: max_hourly_rate
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Filter tutors by maximum hourly rate
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [first_name, last_name, experience, hourly_rate]
 *           default: first_name
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Sort order (ASC or DESC)
 *     responses:
 *       200:
 *         description: List of tutors retrieved successfully
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
 *                     tutors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           email:
 *                             type: string
 *                             example: "john.doe@example.com"
 *                           first_name:
 *                             type: string
 *                             example: "John"
 *                           last_name:
 *                             type: string
 *                             example: "Doe"
 *                           role:
 *                             type: string
 *                             example: "tutor"
 *                           profile_image:
 *                             type: string
 *                             example: "https://example.com/profile.jpg"
 *                           tutorProfile:
 *                             $ref: '#/components/schemas/TutorProfile'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 15
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 2
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('name').optional().isString().withMessage('Name must be a string'),
    query('specialization').optional().isString().withMessage('Specialization must be a string'),
    query('min_experience').optional().isInt({ min: 0 }).withMessage('Minimum experience must be a non-negative integer'),
    query('max_hourly_rate').optional().isFloat({ min: 0 }).withMessage('Maximum hourly rate must be a non-negative number'),
    query('sort_by').optional().isIn(['first_name', 'last_name', 'experience', 'hourly_rate']).withMessage('Sort by must be one of: first_name, last_name, experience, hourly_rate'),
    query('sort_order').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
  ],
  validate,
  tutorController.getAllTutors
);

/**
 * @swagger
 * /api/tutors/{id}:
 *   get:
 *     summary: Get a tutor by ID
 *     description: |
 *       Retrieves a tutor by their ID, including their profile information.
 *       
 *       ## Example Request
 *       ```
 *       GET /api/tutors/2
 *       ```
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tutor ID
 *     responses:
 *       200:
 *         description: Tutor retrieved successfully
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
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     role:
 *                       type: string
 *                       example: "tutor"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     tutorProfile:
 *                       $ref: '#/components/schemas/TutorProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tutor not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Tutor ID must be an integer')
  ],
  validate,
  tutorController.getTutorById
);

/**
 * @swagger
 * /api/tutors:
 *   post:
 *     summary: Create a new tutor
 *     description: |
 *       Creates a new tutor with their profile information.
 *       Only administrators can create tutors.
 *       
 *       ## Example Request
 *       ```json
 *       {
 *         "email": "jane.smith@example.com",
 *         "password": "securePassword123",
 *         "first_name": "Jane",
 *         "last_name": "Smith",
 *         "profile_image": "https://example.com/jane.jpg",
 *         "bio": "Experienced English tutor with a passion for teaching",
 *         "specialization": "Business English",
 *         "experience": 5,
 *         "hourly_rate": 25.50
 *       }
 *       ```
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.smith@example.com"
 *                 description: Tutor's email address (must be unique)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *                 description: Tutor's password (min 8 characters)
 *               first_name:
 *                 type: string
 *                 example: "Jane"
 *                 description: Tutor's first name
 *               last_name:
 *                 type: string
 *                 example: "Smith"
 *                 description: Tutor's last name
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/jane.jpg"
 *                 description: URL to tutor's profile image
 *               bio:
 *                 type: string
 *                 example: "Experienced English tutor with a passion for teaching"
 *                 description: Tutor's biography
 *               specialization:
 *                 type: string
 *                 example: "Business English"
 *                 enum: [General English, Business English, Academic English, Conversation, Exam Preparation, Children's English]
 *                 description: Tutor's specialization area
 *               experience:
 *                 type: integer
 *                 example: 5
 *                 minimum: 0
 *                 description: Tutor's years of experience
 *               hourly_rate:
 *                 type: number
 *                 format: float
 *                 example: 25.50
 *                 minimum: 0
 *                 description: Tutor's hourly rate
 *     responses:
 *       201:
 *         description: Tutor created successfully
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
 *                   example: "Tutor created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     email:
 *                       type: string
 *                       example: "jane.smith@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "Jane"
 *                     last_name:
 *                       type: string
 *                       example: "Smith"
 *                     role:
 *                       type: string
 *                       example: "tutor"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/jane.jpg"
 *                     tutorProfile:
 *                       $ref: '#/components/schemas/TutorProfile'
 *       400:
 *         description: Invalid input or email already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only administrators can create tutors
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('profile_image').optional().isURL().withMessage('Profile image must be a valid URL'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('specialization').optional().isString().withMessage('Specialization must be a string'),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
    body('hourly_rate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a non-negative number')
  ],
  validate,
  tutorController.createTutor
);

/**
 * @swagger
 * /api/tutors/{id}:
 *   put:
 *     summary: Update a tutor
 *     description: |
 *       Updates a tutor's information and profile.
 *       Tutors can update their own profiles, and administrators can update any tutor.
 *       
 *       ## Example Request
 *       ```json
 *       {
 *         "first_name": "John",
 *         "last_name": "Doe",
 *         "profile_image": "https://example.com/john_updated.jpg",
 *         "bio": "Updated bio with more details about teaching experience",
 *         "specialization": "Business and Academic English",
 *         "experience": 6,
 *         "hourly_rate": 30.00
 *       }
 *       ```
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tutor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *                 description: Tutor's first name
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *                 description: Tutor's last name
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/john_updated.jpg"
 *                 description: URL to tutor's profile image
 *               bio:
 *                 type: string
 *                 example: "Updated bio with more details about teaching experience"
 *                 description: Tutor's biography
 *               specialization:
 *                 type: string
 *                 example: "Business and Academic English"
 *                 enum: [General English, Business English, Academic English, Conversation, Exam Preparation, Children's English]
 *                 description: Tutor's specialization area
 *               experience:
 *                 type: integer
 *                 example: 6
 *                 minimum: 0
 *                 description: Tutor's years of experience
 *               hourly_rate:
 *                 type: number
 *                 format: float
 *                 example: 30.00
 *                 minimum: 0
 *                 description: Tutor's hourly rate
 *     responses:
 *       200:
 *         description: Tutor updated successfully
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
 *                   example: "Tutor updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     role:
 *                       type: string
 *                       example: "tutor"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/john_updated.jpg"
 *                     tutorProfile:
 *                       $ref: '#/components/schemas/TutorProfile'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - you are not authorized to update this tutor
 *       404:
 *         description: Tutor not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Tutor ID must be an integer'),
    body('first_name').optional().isString().withMessage('First name must be a string'),
    body('last_name').optional().isString().withMessage('Last name must be a string'),
    body('profile_image').optional().isURL().withMessage('Profile image must be a valid URL'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('specialization').optional().isString().withMessage('Specialization must be a string'),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
    body('hourly_rate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a non-negative number')
  ],
  validate,
  tutorController.updateTutor
);

/**
 * @swagger
 * /api/tutors/{id}:
 *   delete:
 *     summary: Delete a tutor
 *     description: |
 *       Deletes a tutor and their profile.
 *       Only administrators can delete tutors.
 *       
 *       ## Example Request
 *       ```
 *       DELETE /api/tutors/3
 *       ```
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tutor ID
 *     responses:
 *       200:
 *         description: Tutor deleted successfully
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
 *                   example: "Tutor deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only administrators can delete tutors
 *       404:
 *         description: Tutor not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('Tutor ID must be an integer')
  ],
  validate,
  tutorController.deleteTutor
);

module.exports = router;
