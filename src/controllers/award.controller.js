const db = require('../models');
const { Award, UserAward, User } = db;
const { Op } = db.Sequelize;
const { getPaginationParams, getPaginationMetadata, applyPagination } = require('../utils/pagination.utils');

/**
 * Get all awards with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllAwards = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const {
      name,
      category,
      sort_by = 'name',
      sort_order = 'ASC'
    } = req.query;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Build the where clause for filtering
    const where = {};
    
    // Filter by name if provided
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    
    // Filter by category if provided
    if (category) {
      where.category = category;
    }
    
    // Determine the order
    let order = [[sort_by, sort_order]];
    
    // Prepare query options
    let queryOptions = {
      where,
      order: order
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all awards
    const { count, rows: awards } = await Award.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        awards,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get all awards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting awards',
      error: error.message
    });
  }
};

/**
 * Get an award by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAwardById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const award = await Award.findByPk(id);
    
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: award
    });
  } catch (error) {
    console.error('Get award by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting award',
      error: error.message
    });
  }
};

/**
 * Create a new award
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createAward = async (req, res) => {
  try {
    const { name, description, category, image_url, points_required } = req.body;
    
    const award = await Award.create({
      name,
      description,
      category,
      image_url,
      points_required
    });
    
    res.status(201).json({
      success: true,
      message: 'Award created successfully',
      data: award
    });
  } catch (error) {
    console.error('Create award error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating award',
      error: error.message
    });
  }
};

/**
 * Update an award
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, image_url, points_required } = req.body;
    
    // Check if award exists
    const award = await Award.findByPk(id);
    
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }
    
    // Update award
    await award.update({
      name,
      description,
      category,
      image_url,
      points_required
    });
    
    res.status(200).json({
      success: true,
      message: 'Award updated successfully',
      data: award
    });
  } catch (error) {
    console.error('Update award error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating award',
      error: error.message
    });
  }
};

/**
 * Delete an award
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if award exists
    const award = await Award.findByPk(id);
    
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }
    
    // Delete award
    await award.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    console.error('Delete award error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting award',
      error: error.message
    });
  }
};

/**
 * Get all user awards with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserAwards = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prepare query options
    let queryOptions = {
      where: { user_id },
      include: [
        {
          model: Award,
          as: 'award'
        }
      ],
      order: [['awarded_at', 'DESC']]
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all user awards
    const { count, rows: userAwards } = await UserAward.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        userAwards,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get user awards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user awards',
      error: error.message
    });
  }
};

/**
 * Award a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const awardUser = async (req, res) => {
  try {
    const { user_id, award_id } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if award exists
    const award = await Award.findByPk(award_id);
    
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }
    
    // Check if user already has this award
    const existingUserAward = await UserAward.findOne({
      where: {
        user_id,
        award_id
      }
    });
    
    if (existingUserAward) {
      return res.status(400).json({
        success: false,
        message: 'User already has this award'
      });
    }
    
    // Create user award
    const userAward = await UserAward.create({
      user_id,
      award_id,
      awarded_at: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Award granted to user successfully',
      data: userAward
    });
  } catch (error) {
    console.error('Award user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error awarding user',
      error: error.message
    });
  }
};

module.exports = {
  getAllAwards,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
  getUserAwards,
  awardUser
};
