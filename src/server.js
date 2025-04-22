const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const studentRoutes = require('./routes/student.routes');
const tutorRoutes = require('./routes/tutor.routes');
const skinRoutes = require('./routes/skin.routes');
const diaryRoutes = require('./routes/diary.routes');
const diaryPageRoutes = require('./routes/diary-page.routes');
const chatRoutes = require('./routes/chat.routes');
const awardRoutes = require('./routes/award.routes');
const forumRoutes = require('./routes/forum.routes');
const imageRoutes = require('./routes/image.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
// Configure CORS to allow requests from all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/skins', skinRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/diary-pages', diaryPageRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/images', imageRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hello English Coaching API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


module.exports = app; // For testing purposes
