# Hello English Coaching Backend

A Node.js, Express, and MySQL backend for the Hello English Coaching platform.

## Features

- **User Authentication**: JWT-based authentication for student, tutor, and admin roles
- **Skins**: Manage customizable skins stored in JSON format
- **Diaries**: CRUD functionality for user diaries with skins applied
- **Chats**: REST APIs for chat functionality
- **Awards**: Track and assign awards to users
- **Forums**: Support forum discussions and posts
- **Image Upload**: Image uploads using Multer with local storage
- **Validation**: Input validation using express-validator
- **Swagger Documentation**: API documentation with Swagger

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd hec-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hec_db
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h

   # Local Storage Configuration
   UPLOAD_PATH=uploads
   ```

4. Initialize the database:
   ```
   node src/config/init-db.js
   ```

## Running the Application

### Development Mode
```
npm run dev
```

### Production Mode
```
npm start
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/password` - Update user password

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Skins
- `POST /api/skins` - Create a new skin
- `GET /api/skins` - Get all skins
- `GET /api/skins/:id` - Get skin by ID
- `PUT /api/skins/:id` - Update skin
- `DELETE /api/skins/:id` - Delete skin

### Diaries
- `POST /api/diaries` - Create a new diary
- `GET /api/diaries` - Get all diaries
- `GET /api/diaries/:id` - Get diary by ID
- `PUT /api/diaries/:id` - Update diary
- `DELETE /api/diaries/:id` - Delete diary

### Chats
- `POST /api/chats` - Create a new chat
- `GET /api/chats` - Get all chats for current user
- `GET /api/chats/:id` - Get chat by ID
- `GET /api/chats/:id/messages` - Get messages for a chat
- `POST /api/chats/:id/messages` - Send a message to a chat

### Awards
- `POST /api/awards` - Create a new award (admin only)
- `GET /api/awards` - Get all awards
- `GET /api/awards/:id` - Get award by ID
- `PUT /api/awards/:id` - Update award (admin only)
- `DELETE /api/awards/:id` - Delete award (admin only)
- `POST /api/awards/assign` - Assign an award to a user
- `GET /api/awards/user/:userId` - Get all awards for a user

### Forums
- `POST /api/forums` - Create a new forum (admin only)
- `GET /api/forums` - Get all forums
- `GET /api/forums/:id` - Get forum by ID
- `GET /api/forums/:id/topics` - Get all topics for a forum
- `POST /api/forums/:id/topics` - Create a new topic in a forum
- `GET /api/forums/topics/:topicId` - Get topic by ID
- `GET /api/forums/topics/:topicId/posts` - Get all posts for a topic
- `POST /api/forums/topics/:topicId/posts` - Create a new post in a topic

### Images
- `POST /api/images/upload` - Upload an image
- `GET /api/images` - Get all images for current user
- `DELETE /api/images/:id` - Delete an image

## Testing

```
npm test
```

## License

[MIT](LICENSE)
