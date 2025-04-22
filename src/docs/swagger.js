const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello English Coaching API',
      version: '1.0.0',
      description: 'API documentation for Hello English Coaching platform',
      contact: {
        name: 'API Support',
        email: 'support@helloenlishcoaching.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'API endpoints for user authentication'
      },
      {
        name: 'Users',
        description: 'API endpoints for user management'
      },
      {
        name: 'Profiles',
        description: 'API endpoints for user profile management'
      },
      {
        name: 'Students',
        description: 'API endpoints for student management'
      },
      {
        name: 'Tutors',
        description: 'API endpoints for tutor management'
      },
      {
        name: 'Skins',
        description: 'API endpoints for skin management'
      },
      {
        name: 'Diaries',
        description: 'API endpoints for diary management'
      },
      {
        name: 'Diary Pages',
        description: 'API endpoints for diary page management'
      },
      {
        name: 'Chats',
        description: 'API endpoints for chat management'
      },
      {
        name: 'Awards',
        description: 'API endpoints for award management'
      },
      {
        name: 'Forums',
        description: 'API endpoints for forum management'
      },
      {
        name: 'Images',
        description: 'API endpoints for image management'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/routes/diary-page.routes.js', // Explicitly include diary-page routes
    './src/routes/student.routes.js', // Explicitly include student routes
    './src/routes/tutor.routes.js' // Explicitly include tutor routes
  ], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
