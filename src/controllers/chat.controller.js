const db = require('../models');
const { User, Chat, Message, ChatParticipant } = db;
const { Op } = db.Sequelize;
const socketService = require('../services/socket.service');

/**
 * Get all chats for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all chats where the user is a participant
    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'first_name', 'last_name', 'profile_image'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ],
      order: [['updated_at', 'DESC']],
      where: {
        '$participants.id$': userId
      }
    });
    
    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Get my chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chats',
      error: error.message
    });
  }
};

/**
 * Get a chat by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find chat by ID
    const chat = await Chat.findByPk(id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if user is a participant
    const isParticipant = chat.participants.some(participant => participant.id === userId);
    
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Get chat by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat',
      error: error.message
    });
  }
};

/**
 * Get messages for a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Check if user is a participant
    const participant = await ChatParticipant.findOne({
      where: {
        chat_id: id,
        user_id: userId
      }
    });
    
    if (!participant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }
    
    // Get total count of messages
    const count = await Message.count({
      where: { chat_id: id }
    });
    
    // Get messages with pagination
    const messages = await Message.findAll({
      where: { chat_id: id },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'profile_image']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat messages',
      error: error.message
    });
  }
};

/**
 * Create a new chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createChat = async (req, res) => {
  try {
    const { name, is_group, participant_ids } = req.body;
    const userId = req.user.id;
    
    // Validate participant IDs
    if (!participant_ids || !Array.isArray(participant_ids) || participant_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one participant is required'
      });
    }
    
    // For non-group chats, check if a chat already exists between these users
    if (!is_group && participant_ids.length === 1) {
      const existingChat = await Chat.findOne({
        include: [
          {
            model: User,
            as: 'participants',
            attributes: ['id'],
            through: { attributes: [] },
            where: {
              id: {
                [Op.in]: [userId, ...participant_ids]
              }
            }
          }
        ],
        where: {
          is_group: false
        },
        having: db.sequelize.literal('COUNT(DISTINCT `participants`.`id`) = 2')
      });
      
      if (existingChat) {
        return res.status(400).json({
          success: false,
          message: 'A chat already exists between these users',
          data: { chatId: existingChat.id }
        });
      }
    }
    
    // Start a transaction
    const transaction = await db.sequelize.transaction();
    
    try {
      // Create chat
      const chat = await Chat.create({
        name: is_group ? name : null,
        is_group: !!is_group,
        created_by: userId
      }, { transaction });
      
      // Add creator as participant
      await ChatParticipant.create({
        chat_id: chat.id,
        user_id: userId
      }, { transaction });
      
      // Add other participants
      for (const participantId of participant_ids) {
        // Skip if participant ID is the same as creator
        if (participantId === userId) continue;
        
        // Check if user exists
        const user = await User.findByPk(participantId);
        if (!user) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `User with ID ${participantId} not found`
          });
        }
        
        await ChatParticipant.create({
          chat_id: chat.id,
          user_id: participantId
        }, { transaction });
      }
      
      // If initial message is provided, create it
      if (req.body.initial_message) {
        await Message.create({
          chat_id: chat.id,
          sender_id: userId,
          content: req.body.initial_message
        }, { transaction });
      }
      
      // Commit the transaction
      await transaction.commit();
      
      // Get the created chat with participants
      const createdChat = await Chat.findByPk(chat.id, {
        include: [
          {
            model: User,
            as: 'participants',
            attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role'],
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Message,
            as: 'messages',
            limit: 1,
            order: [['created_at', 'DESC']],
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['id', 'first_name', 'last_name']
              }
            ]
          }
        ]
      });
      
      // Notify participants about the new chat
      for (const participantId of participant_ids) {
        if (participantId !== userId) {
          try {
            socketService.notifyUser(participantId, 'new-chat', {
              chat: createdChat,
              initiator: {
                id: req.user.id,
                first_name: req.user.first_name,
                last_name: req.user.last_name
              }
            });
          } catch (error) {
            console.error('Socket notification error:', error);
          }
        }
      }
      
      res.status(201).json({
        success: true,
        message: 'Chat created successfully',
        data: createdChat
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat',
      error: error.message
    });
  }
};

/**
 * Add a participant to a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const userId = req.user.id;
    
    // Find chat by ID
    const chat = await Chat.findByPk(id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if the chat is a group chat
    if (!chat.is_group) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add participants to a non-group chat'
      });
    }
    
    // Check if the current user is a participant
    const isParticipant = await ChatParticipant.findOne({
      where: {
        chat_id: id,
        user_id: userId
      }
    });
    
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }
    
    // Check if the user to add exists
    const userToAdd = await User.findByPk(user_id);
    
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if the user is already a participant
    const existingParticipant = await ChatParticipant.findOne({
      where: {
        chat_id: id,
        user_id: user_id
      }
    });
    
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'User is already a participant in this chat'
      });
    }
    
    // Add the user as a participant
    await ChatParticipant.create({
      chat_id: id,
      user_id: user_id
    });
    
    // Create a system message
    await Message.create({
      chat_id: id,
      sender_id: userId,
      content: `${req.user.first_name} ${req.user.last_name} added ${userToAdd.first_name} ${userToAdd.last_name} to the chat`,
      is_system_message: true
    });
    
    // Notify the chat about the new participant
    try {
      socketService.notifyChat(id, 'participant-added', {
        chatId: id,
        user: {
          id: userToAdd.id,
          first_name: userToAdd.first_name,
          last_name: userToAdd.last_name,
          profile_image: userToAdd.profile_image
        },
        addedBy: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name
        }
      });
      
      // Notify the added user
      socketService.notifyUser(user_id, 'added-to-chat', {
        chatId: id,
        chatName: chat.name,
        addedBy: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name
        }
      });
    } catch (error) {
      console.error('Socket notification error:', error);
    }
    
    res.status(200).json({
      success: true,
      message: 'Participant added successfully'
    });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding participant',
      error: error.message
    });
  }
};

/**
 * Remove a participant from a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeParticipant = async (req, res) => {
  try {
    const { id, user_id } = req.params;
    const userId = req.user.id;
    
    // Find chat by ID
    const chat = await Chat.findByPk(id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if the chat is a group chat
    if (!chat.is_group) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove participants from a non-group chat'
      });
    }
    
    // Check if the current user is the creator or an admin
    if (chat.created_by !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the chat creator or an admin can remove participants'
      });
    }
    
    // Check if the user to remove exists
    const userToRemove = await User.findByPk(user_id);
    
    if (!userToRemove) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if the user is a participant
    const participant = await ChatParticipant.findOne({
      where: {
        chat_id: id,
        user_id: user_id
      }
    });
    
    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'User is not a participant in this chat'
      });
    }
    
    // Cannot remove the creator
    if (chat.created_by === parseInt(user_id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot remove the chat creator'
      });
    }
    
    // Remove the participant
    await ChatParticipant.destroy({
      where: {
        chat_id: id,
        user_id: user_id
      }
    });
    
    // Create a system message
    await Message.create({
      chat_id: id,
      sender_id: userId,
      content: `${req.user.first_name} ${req.user.last_name} removed ${userToRemove.first_name} ${userToRemove.last_name} from the chat`,
      is_system_message: true
    });
    
    // Notify the chat about the removed participant
    try {
      socketService.notifyChat(id, 'participant-removed', {
        chatId: id,
        userId: user_id,
        removedBy: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name
        }
      });
      
      // Notify the removed user
      socketService.notifyUser(user_id, 'removed-from-chat', {
        chatId: id,
        chatName: chat.name,
        removedBy: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name
        }
      });
    } catch (error) {
      console.error('Socket notification error:', error);
    }
    
    res.status(200).json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing participant',
      error: error.message
    });
  }
};

/**
 * Send a message in a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    // Check if user is a participant
    const participant = await ChatParticipant.findOne({
      where: {
        chat_id: id,
        user_id: userId
      }
    });
    
    if (!participant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }
    
    // Create message
    const message = await Message.create({
      chat_id: id,
      sender_id: userId,
      content
    });
    
    // Get the created message with sender info
    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'profile_image']
        }
      ]
    });
    
    // Update chat's updated_at timestamp
    await Chat.update(
      { updated_at: new Date() },
      { where: { id } }
    );
    
    // Notify chat participants about the new message
    try {
      socketService.notifyChat(id, 'new-message', messageWithSender);
    } catch (error) {
      console.error('Socket notification error:', error);
    }
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: messageWithSender
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Leave a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const leaveChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find chat by ID
    const chat = await Chat.findByPk(id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if the chat is a group chat
    if (!chat.is_group) {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave a non-group chat'
      });
    }
    
    // Check if the user is a participant
    const participant = await ChatParticipant.findOne({
      where: {
        chat_id: id,
        user_id: userId
      }
    });
    
    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }
    
    // If the user is the creator, assign a new creator
    if (chat.created_by === userId) {
      // Find another participant
      const newCreator = await ChatParticipant.findOne({
        where: {
          chat_id: id,
          user_id: {
            [Op.ne]: userId
          }
        }
      });
      
      // If there are no other participants, delete the chat
      if (!newCreator) {
        await Chat.destroy({
          where: { id }
        });
        
        return res.status(200).json({
          success: true,
          message: 'You were the last participant. Chat has been deleted.'
        });
      }
      
      // Update the chat creator
      await Chat.update(
        { created_by: newCreator.user_id },
        { where: { id } }
      );
    }
    
    // Remove the participant
    await ChatParticipant.destroy({
      where: {
        chat_id: id,
        user_id: userId
      }
    });
    
    // Create a system message
    await Message.create({
      chat_id: id,
      sender_id: userId,
      content: `${req.user.first_name} ${req.user.last_name} left the chat`,
      is_system_message: true
    });
    
    // Notify the chat that the user left
    try {
      socketService.notifyChat(id, 'participant-left', {
        chatId: id,
        user: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name
        }
      });
    } catch (error) {
      console.error('Socket notification error:', error);
    }
    
    res.status(200).json({
      success: true,
      message: 'You have left the chat'
    });
  } catch (error) {
    console.error('Leave chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving chat',
      error: error.message
    });
  }
};

module.exports = {
  getMyChats,
  getChatById,
  getChatMessages,
  createChat,
  addParticipant,
  removeParticipant,
  sendMessage,
  leaveChat
};
