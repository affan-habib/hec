const express = require('express');
const { body, param, query } = require('express-validator');
const studentController = require('../controllers/student.controller');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: |
 *       Retrieves a list of all students with their profiles.
 *       Supports pagination, filtering, and sorting.
 *       
 *       ## Filtering Options
 *       - **name**: Filter by student's first or last name (partial match)
 *       - **level**: Filter by English proficiency level
 *       
 *       ## Sorting Options
 *       - **sort_by**: Field to sort by (first_name, last_name, level)
 *       - **sort_order**: Sort order (ASC or DESC)
 *       
 *       ## Pagination
 *       - **page**: Page number (default: 1)
 *       - **limit**: Number of students per page (default: 10)
 *       
 *       ## Example Requests
 *       
 *       Basic request:
 *       ```
 *       GET /api/students
 *       ```
 *       
 *       With filtering:
 *       ```
 *       GET /api/students?name=Jane&level=Intermediate
 *       ```
 *       
 *       With sorting:
 *       ```
 *       GET /api/students?sort_by=level&sort_order=ASC
 *       ```
 *       
 *       With pagination:
 *       ```
 *       GET /api/students?page=2&limit=5
 *       ```
 *     tags: [Students]
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
 *         description: Number of students per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter students by first or last name (partial match)
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Proficient]
 *         description: Filter students by English proficiency level
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [first_name, last_name, level]
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
 *         description: List of students retrieved successfully
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
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           email:
 *                             type: string
 *                             example: "jane.smith@example.com"
 *                           first_name:
 *                             type: string
 *                             example: "Jane"
 *                           last_name:
 *                             type: string
 *                             example: "Smith"
 *                           role:
 *                             type: string
 *                             example: "student"
 *                           profile_image:
 *                             type: string
 *                             example: "https://example.com/profile.jpg"
 *                           studentProfile:
 *                             $ref: '#/components/schemas/StudentProfile'
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
    query('level').optional().isString().withMessage('Level must be a string'),
    query('sort_by').optional().isIn(['first_name', 'last_name', 'level']).withMessage('Sort by must be one of: first_name, last_name, level'),
    query('sort_order').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
  ],
  validate,
  studentController.getAllStudents
);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: |
 *       Retrieves a student by their ID, including their profile information.
 *       
 *       ## Example Request
 *       ```
 *       GET /api/students/3
 *       ```
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
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
 *                       example: "student"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     studentProfile:
 *                       $ref: '#/components/schemas/StudentProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Student ID must be an integer')
  ],
  validate,
  studentController.getStudentById
);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     description: |
 *       Creates a new student with their profile information.
 *       Only administrators can create students.
 *       
 *       ## Example Request
 *       ```json
 *       {
 *         "email": "jane.smith@example.com",
 *         "password": "securePassword123",
 *         "first_name": "Jane",
 *         "last_name": "Smith",
 *         "profile_image": "https://example.com/jane.jpg",
 *         "level": "Intermediate",
 *         "learning_goals": "Improve conversation skills and prepare for IELTS exam",
 *         "interests": "Reading, Music, Travel, Movies"
 *       }
 *       ```
 *     tags: [Students]
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
 *                 description: Student's email address (must be unique)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *                 description: Student's password (min 8 characters)
 *               first_name:
 *                 type: string
 *                 example: "Jane"
 *                 description: Student's first name
 *               last_name:
 *                 type: string
 *                 example: "Smith"
 *                 description: Student's last name
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/jane.jpg"
 *                 description: URL to student's profile image
 *               level:
 *                 type: string
 *                 example: "Intermediate"
 *                 enum: [Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Proficient]
 *                 description: Student's English proficiency level
 *               learning_goals:
 *                 type: string
 *                 example: "Improve conversation skills and prepare for IELTS exam"
 *                 description: Student's learning goals
 *               interests:
 *                 type: string
 *                 example: "Reading, Music, Travel, Movies"
 *                 description: Student's interests
 *     responses:
 *       201:
 *         description: Student created successfully
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
 *                   example: "Student created successfully"
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
 *                       example: "student"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/jane.jpg"
 *                     studentProfile:
 *                       $ref: '#/components/schemas/StudentProfile'
 *       400:
 *         description: Invalid input or email already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only administrators can create students
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
    body('level').optional().isString().withMessage('Level must be a string'),
    body('learning_goals').optional().isString().withMessage('Learning goals must be a string'),
    body('interests').optional().isString().withMessage('Interests must be a string')
  ],
  validate,
  studentController.createStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     description: |
 *       Updates a student's information and profile.
 *       Students can update their own profiles, and administrators can update any student.
 *       
 *       ## Example Request
 *       ```json
 *       {
 *         "first_name": "Jane",
 *         "last_name": "Smith",
 *         "profile_image": "https://example.com/jane_updated.jpg",
 *         "level": "Upper-Intermediate",
 *         "learning_goals": "Prepare for TOEFL exam and improve business English",
 *         "interests": "Reading, Writing, Public Speaking, Travel"
 *       }
 *       ```
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Jane"
 *                 description: Student's first name
 *               last_name:
 *                 type: string
 *                 example: "Smith"
 *                 description: Student's last name
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/jane_updated.jpg"
 *                 description: URL to student's profile image
 *               level:
 *                 type: string
 *                 example: "Upper-Intermediate"
 *                 enum: [Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Proficient]
 *                 description: Student's English proficiency level
 *               learning_goals:
 *                 type: string
 *                 example: "Prepare for TOEFL exam and improve business English"
 *                 description: Student's learning goals
 *               interests:
 *                 type: string
 *                 example: "Reading, Writing, Public Speaking, Travel"
 *                 description: Student's interests
 *     responses:
 *       200:
 *         description: Student updated successfully
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
 *                   example: "Student updated successfully"
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
 *                       example: "student"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/jane_updated.jpg"
 *                     studentProfile:
 *                       $ref: '#/components/schemas/StudentProfile'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - you are not authorized to update this student
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Student ID must be an integer'),
    body('first_name').optional().isString().withMessage('First name must be a string'),
    body('last_name').optional().isString().withMessage('Last name must be a string'),
    body('profile_image').optional().isURL().withMessage('Profile image must be a valid URL'),
    body('level').optional().isString().withMessage('Level must be a string'),
    body('learning_goals').optional().isString().withMessage('Learning goals must be a string'),
    body('interests').optional().isString().withMessage('Interests must be a string')
  ],
  validate,
  studentController.updateStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: |
 *       Deletes a student and their profile.
 *       Only administrators can delete students.
 *       
 *       ## Example Request
 *       ```
 *       DELETE /api/students/3
 *       ```
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
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
 *                   example: "Student deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only administrators can delete students
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('Student ID must be an integer')
  ],
  validate,
  studentController.deleteStudent
);

module.exports = router;
