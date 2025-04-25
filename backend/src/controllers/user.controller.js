const db = require('../models');
const { User, StudentProfile, TutorProfile, AdminProfile } = db;
const { Op } = db.Sequelize;
const { getPaginationParams, getPaginationMetadata, applyPagination } = require('../utils/pagination.utils');

/**
 * Get all users with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const {
      role,
      name,
      email,
      sort_by = 'first_name',
      sort_order = 'ASC'
    } = req.query;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Build the where clause for filtering
    const where = {};
    
    // Filter by role if provided
    if (role) {
      where.role = role;
    }
    
    // Filter by name if provided
    if (name) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${name}%` } },
        { last_name: { [Op.like]: `%${name}%` } }
      ];
    }
    
    // Filter by email if provided
    if (email) {
      where.email = { [Op.like]: `%${email}%` };
    }
    
    // Determine the order
    let order = [[sort_by, sort_order]];
    
    // Prepare query options
    let queryOptions = {
      where,
      attributes: { exclude: ['password'] },
      order: order
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all users
    const { count, rows: users } = await User.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        users,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting users',
      error: error.message
    });
  }
};

/**
 * Get a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: StudentProfile,
          as: 'studentProfile',
          required: false
        },
        {
          model: TutorProfile,
          as: 'tutorProfile',
          required: false
        },
        {
          model: AdminProfile,
          as: 'adminProfile',
          required: false
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user',
      error: error.message
    });
  }
};

/**
 * Update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }
    
    // Update user
    await user.update({
      first_name,
      last_name,
      email,
      role
    });
    
    // Get updated user
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete user
    await user.destroy();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
