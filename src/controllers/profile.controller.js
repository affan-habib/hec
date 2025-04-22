const db = require('../models');
const { User, StudentProfile, TutorProfile, AdminProfile } = db;
const { Op } = db.Sequelize;

/**
 * Get the profile of the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

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

    // Get role-specific profile
    let profile = null;

    if (userRole === 'student') {
      profile = await StudentProfile.findOne({ where: { user_id: userId } });
    } else if (userRole === 'tutor') {
      profile = await TutorProfile.findOne({ where: { user_id: userId } });
    } else if (userRole === 'admin') {
      profile = await AdminProfile.findOne({ where: { user_id: userId } });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
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
 * Update the profile of the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { first_name, last_name, profile_image, ...profileData } = req.body;

    // Start a transaction
    const transaction = await db.sequelize.transaction();

    try {
      // Update user data
      if (first_name || last_name || profile_image) {
        await User.update(
          {
            first_name: first_name || undefined,
            last_name: last_name || undefined,
            profile_image: profile_image || undefined
          },
          {
            where: { id: userId },
            transaction
          }
        );
      }

      // Update role-specific profile
      if (Object.keys(profileData).length > 0) {
        if (userRole === 'student') {
          await StudentProfile.update(
            profileData,
            {
              where: { user_id: userId },
              transaction
            }
          );
        } else if (userRole === 'tutor') {
          await TutorProfile.update(
            profileData,
            {
              where: { user_id: userId },
              transaction
            }
          );
        } else if (userRole === 'admin') {
          await AdminProfile.update(
            profileData,
            {
              where: { user_id: userId },
              transaction
            }
          );
        }
      }

      // Commit the transaction
      await transaction.commit();

      // Get updated user and profile
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      let updatedProfile = null;

      if (userRole === 'student') {
        updatedProfile = await StudentProfile.findOne({ where: { user_id: userId } });
      } else if (userRole === 'tutor') {
        updatedProfile = await TutorProfile.findOne({ where: { user_id: userId } });
      } else if (userRole === 'admin') {
        updatedProfile = await AdminProfile.findOne({ where: { user_id: userId } });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser,
          profile: updatedProfile
        }
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

/**
 * Get a user's profile by ID (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get role-specific profile
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ where: { user_id: id } });
    } else if (user.role === 'tutor') {
      profile = await TutorProfile.findOne({ where: { user_id: id } });
    } else if (user.role === 'admin') {
      profile = await AdminProfile.findOne({ where: { user_id: id } });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message
    });
  }
};

/**
 * Update a user's profile by ID (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, profile_image, role, ...profileData } = req.body;

    // Find user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Start a transaction
    const transaction = await db.sequelize.transaction();

    try {
      // Update user data
      if (first_name || last_name || profile_image || role) {
        await User.update(
          {
            first_name: first_name || undefined,
            last_name: last_name || undefined,
            profile_image: profile_image || undefined,
            role: role || undefined
          },
          {
            where: { id },
            transaction
          }
        );
      }

      // If role is changed, create a new profile for the new role
      if (role && role !== user.role) {
        // Delete old profile
        if (user.role === 'student') {
          await StudentProfile.destroy({ where: { user_id: id }, transaction });
        } else if (user.role === 'tutor') {
          await TutorProfile.destroy({ where: { user_id: id }, transaction });
        } else if (user.role === 'admin') {
          await AdminProfile.destroy({ where: { user_id: id }, transaction });
        }

        // Create new profile
        if (role === 'student') {
          await StudentProfile.create({ user_id: id, ...profileData }, { transaction });
        } else if (role === 'tutor') {
          await TutorProfile.create({ user_id: id, ...profileData }, { transaction });
        } else if (role === 'admin') {
          await AdminProfile.create({ user_id: id, ...profileData }, { transaction });
        }
      }
      // Update existing profile if role is not changed
      else if (Object.keys(profileData).length > 0) {
        const userRole = role || user.role;

        if (userRole === 'student') {
          await StudentProfile.update(
            profileData,
            {
              where: { user_id: id },
              transaction
            }
          );
        } else if (userRole === 'tutor') {
          await TutorProfile.update(
            profileData,
            {
              where: { user_id: id },
              transaction
            }
          );
        } else if (userRole === 'admin') {
          await AdminProfile.update(
            profileData,
            {
              where: { user_id: id },
              transaction
            }
          );
        }
      }

      // Commit the transaction
      await transaction.commit();

      // Get updated user and profile
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      let updatedProfile = null;
      const updatedRole = role || user.role;

      if (updatedRole === 'student') {
        updatedProfile = await StudentProfile.findOne({ where: { user_id: id } });
      } else if (updatedRole === 'tutor') {
        updatedProfile = await TutorProfile.findOne({ where: { user_id: id } });
      } else if (updatedRole === 'admin') {
        updatedProfile = await AdminProfile.findOne({ where: { user_id: id } });
      }

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: {
          user: updatedUser,
          profile: updatedProfile
        }
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

/**
 * Get all tutors with their profiles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTutors = async (req, res) => {
  try {
    // Get query parameters for pagination and filtering
    const { page = 1, limit = 10, specialization, min_experience, max_hourly_rate } = req.query;
    const offset = (page - 1) * limit;

    // Build the where clause for filtering
    const tutorWhere = { role: 'tutor' };
    const profileWhere = {};

    if (specialization) {
      profileWhere.specialization = specialization;
    }

    if (min_experience) {
      profileWhere.experience = { [Op.gte]: parseInt(min_experience) };
    }

    if (max_hourly_rate) {
      profileWhere.hourly_rate = { [Op.lte]: parseFloat(max_hourly_rate) };
    }

    // Find all tutors with their profiles
    const { count, rows: tutors } = await User.findAndCountAll({
      where: tutorWhere,
      attributes: { exclude: ['password'] },
      include: [{
        model: TutorProfile,
        as: 'tutorProfile',
        where: Object.keys(profileWhere).length > 0 ? profileWhere : undefined
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['first_name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        tutors,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all tutors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting tutors',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserProfile,
  updateUserProfile,
  getAllTutors
};
