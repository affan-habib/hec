const express = require('express');
const { body, param, query } = require('express-validator');
const profileController = require('../controllers/profile.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     profile:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/StudentProfile'
 *                         - $ref: '#/components/schemas/TutorProfile'
 *                         - $ref: '#/components/schemas/AdminProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', authenticate, profileController.getProfile);

/**
 * @swagger
 * /api/profiles/me:
 *   put:
 *     summary: Update current user's profile
 *     description: |
 *       Updates the current user's profile based on their role.
 *       Different fields are available depending on the user's role (student, tutor, or admin).
 *
 *       ## For Students
 *       Students can update their basic user information and student-specific profile fields:
 *       ```json
 *       {
 *         "first_name": "Jane",
 *         "last_name": "Smith",
 *         "profile_image": "https://example.com/profile.jpg",
 *         "level": "Intermediate",
 *         "learning_goals": "Improve conversation skills and business English",
 *         "interests": "Reading, Music, Travel"
 *       }
 *       ```
 *
 *       ## For Tutors
 *       Tutors can update their basic user information and tutor-specific profile fields:
 *       ```json
 *       {
 *         "first_name": "John",
 *         "last_name": "Doe",
 *         "profile_image": "https://example.com/profile.jpg",
 *         "bio": "Experienced English tutor with a passion for teaching",
 *         "specialization": "Business English",
 *         "experience": 5,
 *         "hourly_rate": 25.50
 *       }
 *       ```
 *
 *       ## For Admins
 *       Admins can update their basic user information and admin-specific profile fields:
 *       ```json
 *       {
 *         "first_name": "Admin",
 *         "last_name": "User",
 *         "profile_image": "https://example.com/profile.jpg",
 *         "department": "Management"
 *       }
 *       ```
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
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
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               # Student profile fields
 *               level:
 *                 type: string
 *                 example: "Intermediate"
 *                 description: "Student's English proficiency level (for students only)"
 *               learning_goals:
 *                 type: string
 *                 example: "Improve conversation skills and business English"
 *                 description: "Student's learning goals (for students only)"
 *               interests:
 *                 type: string
 *                 example: "Reading, Music, Travel"
 *                 description: "Student's interests (for students only)"
 *               # Tutor profile fields
 *               bio:
 *                 type: string
 *                 example: "Experienced English tutor with a passion for teaching"
 *                 description: "Tutor's biography (for tutors only)"
 *               specialization:
 *                 type: string
 *                 example: "Business English"
 *                 description: "Tutor's specialization area (for tutors only)"
 *               experience:
 *                 type: integer
 *                 example: 5
 *                 description: "Tutor's years of experience (for tutors only)"
 *               hourly_rate:
 *                 type: number
 *                 format: float
 *                 example: 25.50
 *                 description: "Tutor's hourly rate (for tutors only)"
 *               # Admin profile fields
 *               department:
 *                 type: string
 *                 example: "Management"
 *                 description: "Admin's department (for admins only)"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     profile:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/StudentProfile'
 *                         - $ref: '#/components/schemas/TutorProfile'
 *                         - $ref: '#/components/schemas/AdminProfile'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put(
  '/me',
  authenticate,
  [
    body('first_name').optional().isString().withMessage('First name must be a string'),
    body('last_name').optional().isString().withMessage('Last name must be a string'),
    body('profile_image').optional().isString().withMessage('Profile image must be a string'),
    // Student profile fields
    body('level').optional().isString().withMessage('Level must be a string'),
    body('learning_goals').optional().isString().withMessage('Learning goals must be a string'),
    body('interests').optional().isString().withMessage('Interests must be a string'),
    // Tutor profile fields
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('specialization').optional().isString().withMessage('Specialization must be a string'),
    body('experience').optional().isInt().withMessage('Experience must be an integer'),
    body('hourly_rate').optional().isFloat().withMessage('Hourly rate must be a number'),
    // Admin profile fields
    body('department').optional().isString().withMessage('Department must be a string')
  ],
  validate,
  profileController.updateProfile
);

/**
 * @swagger
 * /api/profiles/users/{id}:
 *   get:
 *     summary: Get a user's profile by ID (admin only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     profile:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/StudentProfile'
 *                         - $ref: '#/components/schemas/TutorProfile'
 *                         - $ref: '#/components/schemas/AdminProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get(
  '/users/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('User ID must be an integer')
  ],
  validate,
  profileController.getUserProfile
);

/**
 * @swagger
 * /api/profiles/users/{id}:
 *   put:
 *     summary: Update a user's profile by ID (admin only)
 *     description: |
 *       Allows administrators to update any user's profile, including changing their role.
 *       If the role is changed, a new profile for the new role will be created automatically.
 *
 *       ## Changing a Student to a Tutor
 *       ```json
 *       {
 *         "first_name": "Jane",
 *         "last_name": "Smith",
 *         "role": "tutor",
 *         "bio": "New tutor with excellent teaching skills",
 *         "specialization": "Conversation English",
 *         "experience": 2,
 *         "hourly_rate": 20.00
 *       }
 *       ```
 *
 *       ## Updating a Student's Profile
 *       ```json
 *       {
 *         "first_name": "Jane",
 *         "last_name": "Smith",
 *         "level": "Advanced",
 *         "learning_goals": "Prepare for IELTS exam",
 *         "interests": "Reading, Writing, Public Speaking"
 *       }
 *       ```
 *
 *       ## Updating a Tutor's Profile
 *       ```json
 *       {
 *         "first_name": "John",
 *         "last_name": "Doe",
 *         "bio": "Updated bio with more details about teaching experience",
 *         "specialization": "Business and Academic English",
 *         "experience": 6,
 *         "hourly_rate": 30.00
 *       }
 *       ```
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               role:
 *                 type: string
 *                 enum: [student, tutor, admin]
 *                 example: "tutor"
 *                 description: "User's role. If changed, a new profile will be created."
 *               # Student profile fields
 *               level:
 *                 type: string
 *                 example: "Advanced"
 *                 description: "Student's English proficiency level (for students only)"
 *               learning_goals:
 *                 type: string
 *                 example: "Prepare for IELTS exam"
 *                 description: "Student's learning goals (for students only)"
 *               interests:
 *                 type: string
 *                 example: "Reading, Writing, Public Speaking"
 *                 description: "Student's interests (for students only)"
 *               # Tutor profile fields
 *               bio:
 *                 type: string
 *                 example: "Experienced English tutor with a passion for teaching"
 *                 description: "Tutor's biography (for tutors only)"
 *               specialization:
 *                 type: string
 *                 example: "Business and Academic English"
 *                 description: "Tutor's specialization area (for tutors only)"
 *               experience:
 *                 type: integer
 *                 example: 6
 *                 description: "Tutor's years of experience (for tutors only)"
 *               hourly_rate:
 *                 type: number
 *                 format: float
 *                 example: 30.00
 *                 description: "Tutor's hourly rate (for tutors only)"
 *               # Admin profile fields
 *               department:
 *                 type: string
 *                 example: "Management"
 *                 description: "Admin's department (for admins only)"
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: User profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     profile:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/StudentProfile'
 *                         - $ref: '#/components/schemas/TutorProfile'
 *                         - $ref: '#/components/schemas/AdminProfile'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put(
  '/users/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('User ID must be an integer'),
    body('first_name').optional().isString().withMessage('First name must be a string'),
    body('last_name').optional().isString().withMessage('Last name must be a string'),
    body('profile_image').optional().isString().withMessage('Profile image must be a string'),
    body('role').optional().isIn(['student', 'tutor', 'admin']).withMessage('Role must be student, tutor, or admin'),
    // Student profile fields
    body('level').optional().isString().withMessage('Level must be a string'),
    body('learning_goals').optional().isString().withMessage('Learning goals must be a string'),
    body('interests').optional().isString().withMessage('Interests must be a string'),
    // Tutor profile fields
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('specialization').optional().isString().withMessage('Specialization must be a string'),
    body('experience').optional().isInt().withMessage('Experience must be an integer'),
    body('hourly_rate').optional().isFloat().withMessage('Hourly rate must be a number'),
    // Admin profile fields
    body('department').optional().isString().withMessage('Department must be a string')
  ],
  validate,
  profileController.updateUserProfile
);

/**
 * @swagger
 * /api/profiles/tutors:
 *   get:
 *     summary: Get all tutors with their profiles
 *     description: |
 *       Retrieves a list of all tutors with their profiles.
 *       Supports pagination and filtering by specialization, experience, and hourly rate.
 *
 *       ## Example Requests
 *
 *       Get all tutors:
 *       ```
 *       GET /api/profiles/tutors
 *       ```
 *
 *       Get tutors with pagination:
 *       ```
 *       GET /api/profiles/tutors?page=2&limit=5
 *       ```
 *
 *       Get tutors with filtering:
 *       ```
 *       GET /api/profiles/tutors?specialization=Business%20English&min_experience=3&max_hourly_rate=30
 *       ```
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tutors per page
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter tutors by specialization
 *       - in: query
 *         name: min_experience
 *         schema:
 *           type: integer
 *         description: Filter tutors by minimum years of experience
 *       - in: query
 *         name: max_hourly_rate
 *         schema:
 *           type: number
 *         description: Filter tutors by maximum hourly rate
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
  '/tutors',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('specialization').optional().isString().withMessage('Specialization must be a string'),
    query('min_experience').optional().isInt({ min: 0 }).withMessage('Minimum experience must be a non-negative integer'),
    query('max_hourly_rate').optional().isFloat({ min: 0 }).withMessage('Maximum hourly rate must be a non-negative number')
  ],
  validate,
  profileController.getAllTutors
);

module.exports = router;
