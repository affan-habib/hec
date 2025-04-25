# Hello English Coaching - Real-time Chat with Socket.IO

This document explains how to use the real-time chat functionality implemented with Socket.IO in the Hello English Coaching backend.

## Overview

The chat system allows for real-time messaging between users, with features such as:

- Direct (one-to-one) and group chats
- Real-time message delivery
- Typing indicators
- System messages (user joined, left, etc.)
- Chat participant management (add/remove participants)

## Server-Side Implementation

The server-side implementation consists of:

1. **Socket Service** (`src/services/socket.service.js`): Handles Socket.IO initialization, authentication, and event handling.
2. **Chat Controller** (`src/controllers/chat.controller.js`): Provides REST API endpoints for chat management.
3. **Chat Routes** (`src/routes/chat.routes.js`): Defines the API routes for chat functionality.

## Client-Side Example

A simple client-side example is provided in `src/public/chat-example.html`. You can access it at `http://localhost:3000/chat-example.html` when the server is running.

## Socket.IO Authentication

Socket.IO connections are authenticated using JWT tokens. The client must provide the token in the `auth` object when connecting:

```javascript
const socket = io({
  auth: {
    token: authToken // JWT token obtained from login
  }
});
```

## Socket.IO Events

### Server to Client Events

- `new-message`: Sent when a new message is created in a chat.
- `user-typing`: Sent when a user starts or stops typing.
- `user-joined`: Sent when a user joins a chat.
- `user-left`: Sent when a user leaves a chat.
- `notification`: Sent for various notifications (new chat, participant added/removed, etc.).
- `error`: Sent when an error occurs.

### Client to Server Events

- `join-chat`: Sent when a user wants to join a chat room.
- `leave-chat`: Sent when a user wants to leave a chat room.
- `send-message`: Sent when a user wants to send a message.
- `typing`: Sent when a user starts or stops typing.

## REST API Endpoints

The following REST API endpoints are available for chat management:

- `GET /api/chats`: Get all chats for the current user.
- `GET /api/chats/:id`: Get a chat by ID.
- `GET /api/chats/:id/messages`: Get messages for a chat.
- `POST /api/chats`: Create a new chat.
- `POST /api/chats/:id/messages`: Send a message in a chat.
- `POST /api/chats/:id/participants`: Add a participant to a chat.
- `DELETE /api/chats/:id/participants/:user_id`: Remove a participant from a chat.
- `POST /api/chats/:id/leave`: Leave a chat.

## Integration Guide

To integrate the chat functionality into your application:

1. **Authentication**: Obtain a JWT token by logging in through the `/api/auth/login` endpoint.

2. **Connect to Socket.IO**:
   ```javascript
   const socket = io({
     auth: {
       token: authToken
     }
   });
   
   socket.on('connect', () => {
     console.log('Connected to socket server');
   });
   
   socket.on('connect_error', (error) => {
     console.error('Socket connection error:', error);
   });
   ```

3. **Join a Chat**:
   ```javascript
   socket.emit('join-chat', chatId);
   ```

4. **Listen for New Messages**:
   ```javascript
   socket.on('new-message', (message) => {
     console.log('New message:', message);
     // Update UI with the new message
   });
   ```

5. **Send a Message**:
   You can send a message either through the REST API or through Socket.IO:
   
   Using REST API:
   ```javascript
   fetch(`/api/chats/${chatId}/messages`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${authToken}`
     },
     body: JSON.stringify({ content: 'Hello!' })
   });
   ```
   
   Using Socket.IO:
   ```javascript
   socket.emit('send-message', {
     chatId: chatId,
     content: 'Hello!'
   });
   ```

6. **Implement Typing Indicators**:
   ```javascript
   // When user starts typing
   socket.emit('typing', { chatId: chatId, isTyping: true });
   
   // When user stops typing
   socket.emit('typing', { chatId: chatId, isTyping: false });
   
   // Listen for typing events
   socket.on('user-typing', (data) => {
     if (data.isTyping) {
       console.log(`User ${data.userId} is typing...`);
     } else {
       console.log(`User ${data.userId} stopped typing`);
     }
   });
   ```

7. **Handle Notifications**:
   ```javascript
   socket.on('notification', (notification) => {
     console.log('Notification:', notification);
     // Handle different notification types
     switch (notification.type) {
       case 'new-chat':
         // Refresh chat list
         break;
       case 'participant-added':
       case 'participant-removed':
       case 'participant-left':
         // Update chat participants
         break;
     }
   });
   ```

## Testing the Chat Functionality

1. Start the server:
   ```
   npm run dev
   ```

2. Open the example chat application in your browser:
   ```
   http://localhost:3000/chat-example.html
   ```

3. Log in with valid user credentials.

4. Create a new chat or select an existing one.

5. Start sending messages!

## Troubleshooting

- **Socket Connection Issues**: Make sure the JWT token is valid and not expired.
- **Message Not Received**: Ensure that the user has joined the chat room.
- **Permission Errors**: Check that the user is a participant in the chat.

## Security Considerations

- All Socket.IO connections are authenticated using JWT tokens.
- Users can only join chat rooms they are participants in.
- Only chat creators or admins can remove participants from a chat.
- Messages are validated before being sent to other participants.

## Performance Considerations

- Socket.IO uses WebSockets when available, with fallbacks to other transport methods.
- Messages are stored in the database for persistence.
- Real-time events are only sent to relevant participants to minimize network traffic.
