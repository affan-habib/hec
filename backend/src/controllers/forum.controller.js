const db = require('../models');
const { Forum, ForumTopic, ForumPost, User } = db;
const { Op } = db.Sequelize;
const { getPaginationParams, getPaginationMetadata, applyPagination } = require('../utils/pagination.utils');

/**
 * Get all forums
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllForums = async (req, res) => {
  try {
    // Get forums with topic count
    const forums = await Forum.findAll({
      include: [
        {
          model: ForumTopic,
          as: 'topics',
          attributes: []
        }
      ],
      attributes: {
        include: [
          [db.sequelize.fn('COUNT', db.sequelize.col('topics.id')), 'topic_count']
        ]
      },
      group: ['Forum.id'],
      order: [['order', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: forums
    });
  } catch (error) {
    console.error('Get all forums error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting forums',
      error: error.message
    });
  }
};

/**
 * Get a forum by ID with topics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getForumById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Find forum
    const forum = await Forum.findByPk(id);
    
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found'
      });
    }
    
    // Prepare query options for topics
    let queryOptions = {
      where: { forum_id: id },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'profile_image']
        },
        {
          model: User,
          as: 'lastPoster',
          attributes: ['id', 'first_name', 'last_name', 'profile_image']
        }
      ],
      order: [['is_pinned', 'DESC'], ['last_post_at', 'DESC']]
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Get topics with pagination
    const topics = await ForumTopic.findAll(queryOptions);
    
    // Get total count for pagination metadata
    const topicCount = await ForumTopic.count({ where: { forum_id: id } });
    
    res.status(200).json({
      success: true,
      data: {
        forum,
        topics,
        ...getPaginationMetadata(pagination, topicCount)
      }
    });
  } catch (error) {
    console.error('Get forum by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting forum',
      error: error.message
    });
  }
};

/**
 * Get a topic by ID with posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Find topic
    const topic = await ForumTopic.findByPk(id, {
      include: [
        {
          model: Forum,
          as: 'forum'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
        },
        {
          model: User,
          as: 'lastPoster',
          attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
        }
      ]
    });
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }
    
    // Prepare query options for posts
    let queryOptions = {
      where: { topic_id: id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
        }
      ],
      order: [['created_at', 'ASC']]
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Get posts with pagination
    const posts = await ForumPost.findAll(queryOptions);
    
    // Get total count for pagination metadata
    const postCount = await ForumPost.count({ where: { topic_id: id } });
    
    // Increment view count
    await ForumTopic.increment('view_count', { where: { id } });
    
    res.status(200).json({
      success: true,
      data: {
        topic,
        posts,
        ...getPaginationMetadata(pagination, postCount)
      }
    });
  } catch (error) {
    console.error('Get topic by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting topic',
      error: error.message
    });
  }
};

/**
 * Create a new topic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTopic = async (req, res) => {
  try {
    const { forum_id, title, content } = req.body;
    const userId = req.user.id;
    
    // Check if forum exists
    const forum = await Forum.findByPk(forum_id);
    
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found'
      });
    }
    
    // Start a transaction
    const transaction = await db.sequelize.transaction();
    
    try {
      // Create topic
      const topic = await ForumTopic.create({
        forum_id,
        title,
        creator_id: userId,
        last_poster_id: userId,
        last_post_at: new Date()
      }, { transaction });
      
      // Create first post
      const post = await ForumPost.create({
        topic_id: topic.id,
        author_id: userId,
        content
      }, { transaction });
      
      // Commit transaction
      await transaction.commit();
      
      // Get the created topic with related data
      const createdTopic = await ForumTopic.findByPk(topic.id, {
        include: [
          {
            model: Forum,
            as: 'forum'
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
          },
          {
            model: User,
            as: 'lastPoster',
            attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
          }
        ]
      });
      
      res.status(201).json({
        success: true,
        message: 'Topic created successfully',
        data: {
          topic: createdTopic,
          post
        }
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating topic',
      error: error.message
    });
  }
};

/**
 * Create a new post in a topic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPost = async (req, res) => {
  try {
    const { topic_id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    // Check if topic exists
    const topic = await ForumTopic.findByPk(topic_id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }
    
    // Start a transaction
    const transaction = await db.sequelize.transaction();
    
    try {
      // Create post
      const post = await ForumPost.create({
        topic_id,
        author_id: userId,
        content
      }, { transaction });
      
      // Update topic with last post info
      await ForumTopic.update({
        last_poster_id: userId,
        last_post_at: new Date(),
        post_count: db.sequelize.literal('post_count + 1')
      }, { 
        where: { id: topic_id },
        transaction
      });
      
      // Commit transaction
      await transaction.commit();
      
      // Get the created post with author info
      const createdPost = await ForumPost.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
          }
        ]
      });
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: createdPost
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

/**
 * Update a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    // Find post
    const post = await ForumPost.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is the author or an admin
    if (post.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this post'
      });
    }
    
    // Update post
    await post.update({
      content,
      is_edited: true
    });
    
    // Get updated post with author info
    const updatedPost = await ForumPost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'profile_image', 'role']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

/**
 * Delete a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find post
    const post = await ForumPost.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is the author or an admin
    if (post.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this post'
      });
    }
    
    // Get topic to check if it's the first post
    const topic = await ForumTopic.findByPk(post.topic_id);
    const firstPost = await ForumPost.findOne({
      where: { topic_id: post.topic_id },
      order: [['created_at', 'ASC']]
    });
    
    // If it's the first post, delete the entire topic
    if (firstPost.id === post.id) {
      // Start a transaction
      const transaction = await db.sequelize.transaction();
      
      try {
        // Delete all posts in the topic
        await ForumPost.destroy({
          where: { topic_id: post.topic_id },
          transaction
        });
        
        // Delete the topic
        await ForumTopic.destroy({
          where: { id: post.topic_id },
          transaction
        });
        
        // Commit transaction
        await transaction.commit();
        
        return res.status(200).json({
          success: true,
          message: 'Topic and all posts deleted successfully'
        });
      } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        throw error;
      }
    }
    
    // If it's not the first post, just delete the post and update topic
    const transaction = await db.sequelize.transaction();
    
    try {
      // Delete the post
      await post.destroy({ transaction });
      
      // Update topic post count
      await ForumTopic.update({
        post_count: db.sequelize.literal('post_count - 1')
      }, { 
        where: { id: post.topic_id },
        transaction
      });
      
      // If the deleted post was the last post, update the last post info
      if (topic.last_post_at.getTime() === post.created_at.getTime()) {
        const lastPost = await ForumPost.findOne({
          where: { topic_id: post.topic_id },
          order: [['created_at', 'DESC']],
          transaction
        });
        
        if (lastPost) {
          await ForumTopic.update({
            last_poster_id: lastPost.author_id,
            last_post_at: lastPost.created_at
          }, { 
            where: { id: post.topic_id },
            transaction
          });
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

module.exports = {
  getAllForums,
  getForumById,
  getTopicById,
  createTopic,
  createPost,
  updatePost,
  deletePost
};
