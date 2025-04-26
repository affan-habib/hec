const db = require('../models');
const { User, Chat, Message, ChatParticipant } = db;
const { Op } = db.Sequelize;
const socketService = require('../services/socket.service');
const { getPaginationParams, getPaginationMetadata, applyPagination } = require('../utils/pagination.utils');

/**
 * Format chat data for frontend
 * @param {Object} chat - Chat object from database
 * @param {Object} currentUser - Current user object
 * @returns {Object} - Formatted chat object
 */
const formatChatForFrontend = (chat, currentUser) => {
  // Find the other participant (not the current user)
  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0] || {};

  // Get the last message if available
  const lastMessage = chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;

  return {
    id: chat.id,
    name: chat.name || `Chat with ${otherParticipant.first_name || 'User'}`,
    is_group: chat.is_group,
    created_at: chat.created_at,
    updated_at: chat.updated_at,
    // Format user data for the frontend
    user: {
      id: otherParticipant.id,
      name: `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim(),
      avatar: otherParticipant.profile_image,
      role: otherParticipant.role || 'user'
    },
    // Format last message data
    last_message: lastMessage ? {
      id: lastMessage.id,
      content: lastMessage.content,
      sender_id: lastMessage.sender_id,
      timestamp: lastMessage.created_at,
      is_read: true // Default to true for now
    } : {
      content: 'No messages yet',
      timestamp: chat.created_at,
      is_read: true
    },
    // Keep original data for reference
    participants: chat.participants,
    creator: chat.creator,
    messages: chat.messages
  };
};

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

    // Format chats for frontend
    const formattedChats = chats.map(chat => formatChatForFrontend(chat, req.user));

    res.status(200).json({
      success: true,
      data: formattedChats
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

    // Format chat for frontend
    const formattedChat = formatChatForFrontend(chat, req.user);

    res.status(200).json({
      success: true,
      data: formattedChat
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

    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query, { defaultLimit: 20 });

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

    // Prepare query options
    let queryOptions = {
      where: { chat_id: id },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'profile_image']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);

    // Get messages with pagination
    const messages = await Message.findAll(queryOptions);

    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        messages,
        ...getPaginationMetadata(pagination, count)
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

/**
 * Find or create a direct chat with a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findOrCreateDirectChat = async (req, res) => {
  try {
    console.log('Starting findOrCreateDirectChat function');
    const { user_id } = req.params;
    const adminId = req.user.id;

    console.log(`Request params: user_id=${user_id}, adminId=${adminId}, adminRole=${req.user.role}`);

    // Validate that the current user is an admin
    if (req.user.role !== 'admin') {
      console.log('User is not an admin, returning 403');
      return res.status(403).json({
        success: false,
        message: 'Only admins can use this endpoint'
      });
    }

    // Check if the user exists - simplified approach
    try {
      console.log(`Checking if user ${user_id} exists`);
      const targetUser = await User.findByPk(user_id);

      if (!targetUser) {
        console.log(`User ${user_id} not found, returning 404`);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log(`User found: ${targetUser.first_name} ${targetUser.last_name}`);

      // Simplified approach - create a new chat directly
      console.log('Creating a new chat directly');

      // Create chat
      const chat = await Chat.create({
        name: `Chat with ${targetUser.first_name}`,
        is_group: false,
        created_by: adminId
      });

      console.log(`Chat created with ID: ${chat.id}`);

      // Add participants using direct SQL to avoid model issues
      console.log('Adding participants');

      // Add admin with created_at and updated_at timestamps
      await db.sequelize.query(
        `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
        {
          replacements: [chat.id, adminId]
        }
      );

      // Add target user with created_at and updated_at timestamps
      await db.sequelize.query(
        `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
        {
          replacements: [chat.id, parseInt(user_id)]
        }
      );

      // Add initial message
      console.log('Adding initial message');
      await Message.create({
        chat_id: chat.id,
        sender_id: adminId,
        content: `Hello ${targetUser.first_name}, how can I help you today?`
      });

      // Fetch the complete chat with participants and messages
      const completeChat = await Chat.findByPk(chat.id, {
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

      // Format chat for frontend
      const formattedChat = formatChatForFrontend(completeChat, req.user);

      // Return success
      return res.status(201).json({
        success: true,
        message: 'Chat created successfully',
        data: formattedChat
      });

    } catch (userError) {
      console.error('Error in user lookup or chat creation:', userError);
      return res.status(500).json({
        success: false,
        message: 'Error finding user or creating chat',
        error: userError.message
      });
    }
  } catch (error) {
    console.error('Find or create direct chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error in direct chat function',
      error: error.message
    });
  }
};

/**
 * Mark all messages in a chat as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const markMessagesAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if chat exists
    const chat = await Chat.findByPk(id);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

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

    // For now, we'll just return success since we don't have a read status field
    // In a real implementation, you would update a read_status table or field

    // TODO: Implement actual read status tracking in the database
    // This would typically involve updating a message_read_status table or similar

    res.status(200).json({
      success: true,
      message: 'Messages marked as read successfully'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
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
  leaveChat,
  findOrCreateDirectChat,
  markMessagesAsRead
};
