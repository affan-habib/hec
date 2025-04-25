const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { User, Chat, Message, ChatParticipant } = db;

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 */
const initialize = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*', // In production, restrict this to your frontend domain
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.email})`);
    
    // Join user's personal room
    socket.join(`user:${socket.user.id}`);
    
    // Handle joining chat rooms
    socket.on('join-chat', async (chatId) => {
      try {
        // Check if user is a participant in this chat
        const participant = await ChatParticipant.findOne({
          where: {
            chat_id: chatId,
            user_id: socket.user.id
          }
        });
        
        if (!participant) {
          socket.emit('error', { message: 'You are not a participant in this chat' });
          return;
        }
        
        // Join the chat room
        socket.join(`chat:${chatId}`);
        console.log(`User ${socket.user.id} joined chat ${chatId}`);
        
        // Notify other participants that user has joined
        socket.to(`chat:${chatId}`).emit('user-joined', {
          chatId,
          user: {
            id: socket.user.id,
            first_name: socket.user.first_name,
            last_name: socket.user.last_name
          }
        });
      } catch (error) {
        console.error('Error joining chat:', error);
        socket.emit('error', { message: 'Error joining chat' });
      }
    });
    
    // Handle leaving chat rooms
    socket.on('leave-chat', (chatId) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${socket.user.id} left chat ${chatId}`);
      
      // Notify other participants that user has left
      socket.to(`chat:${chatId}`).emit('user-left', {
        chatId,
        userId: socket.user.id
      });
    });
    
    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content } = data;
        
        if (!chatId || !content) {
          socket.emit('error', { message: 'Chat ID and content are required' });
          return;
        }
        
        // Check if user is a participant in this chat
        const participant = await ChatParticipant.findOne({
          where: {
            chat_id: chatId,
            user_id: socket.user.id
          }
        });
        
        if (!participant) {
          socket.emit('error', { message: 'You are not a participant in this chat' });
          return;
        }
        
        // Create message in database
        const message = await Message.create({
          chat_id: chatId,
          sender_id: socket.user.id,
          content
        });
        
        // Get the created message with sender info
        const messageWithSender = await Message.findByPk(message.id, {
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'first_name', 'last_name', 'profile_image']
          }]
        });
        
        // Broadcast message to all participants in the chat
        io.to(`chat:${chatId}`).emit('new-message', messageWithSender);
        
        // Update chat's updated_at timestamp
        await Chat.update(
          { updated_at: new Date() },
          { where: { id: chatId } }
        );
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      const { chatId, isTyping } = data;
      
      // Broadcast typing status to other participants
      socket.to(`chat:${chatId}`).emit('user-typing', {
        chatId,
        userId: socket.user.id,
        isTyping
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id} (${socket.user.email})`);
    });
  });

  return io;
};

/**
 * Get the Socket.IO instance
 * @returns {Object} - Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

/**
 * Send a notification to a specific user
 * @param {number} userId - User ID
 * @param {string} type - Notification type
 * @param {Object} data - Notification data
 */
const notifyUser = (userId, type, data) => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  
  io.to(`user:${userId}`).emit('notification', {
    type,
    data,
    timestamp: new Date()
  });
};

/**
 * Send a notification to all participants in a chat
 * @param {number} chatId - Chat ID
 * @param {string} type - Notification type
 * @param {Object} data - Notification data
 */
const notifyChat = (chatId, type, data) => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  
  io.to(`chat:${chatId}`).emit('notification', {
    type,
    data,
    timestamp: new Date()
  });
};

module.exports = {
  initialize,
  getIO,
  notifyUser,
  notifyChat
};
