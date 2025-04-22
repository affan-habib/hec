const db = require('../models');
const { User, StudentProfile, TutorProfile, AdminProfile } = db;
const { generateToken } = require('../utils/jwt.utils');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = 'student' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Start a transaction
    const transaction = await db.sequelize.transaction();

    try {
      // Create new user
      const user = await User.create({
        email,
        password,
        first_name,
        last_name,
        role
      }, { transaction });

      // Create role-specific profile
      if (role === 'student') {
        await StudentProfile.create({
          user_id: user.id
        }, { transaction });
      } else if (role === 'tutor') {
        await TutorProfile.create({
          user_id: user.id
        }, { transaction });
      } else if (role === 'admin') {
        await AdminProfile.create({
          user_id: user.id
        }, { transaction });
      }

      // Commit the transaction
      await transaction.commit();

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const userWithoutPassword = user.toJSON();
      delete userWithoutPassword.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message
    });
  }
};

/**
 * Update user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.verifyPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updatePassword
};
