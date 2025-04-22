const db = require('../models');
const { User, TutorProfile } = db;
const { Op } = db.Sequelize;

/**
 * Get all tutors with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTutors = async (req, res) => {
  try {
    // Get query parameters for pagination and filtering
    const { 
      page = 1, 
      limit = 10, 
      specialization, 
      min_experience, 
      max_hourly_rate,
      name,
      sort_by = 'first_name',
      sort_order = 'ASC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build the where clause for filtering
    const tutorWhere = { role: 'tutor' };
    const profileWhere = {};
    
    // Filter by name (first_name or last_name)
    if (name) {
      tutorWhere[Op.or] = [
        { first_name: { [Op.like]: `%${name}%` } },
        { last_name: { [Op.like]: `%${name}%` } }
      ];
    }
    
    // Filter by specialization
    if (specialization) {
      profileWhere.specialization = specialization;
    }
    
    // Filter by minimum experience
    if (min_experience) {
      profileWhere.experience = { [Op.gte]: parseInt(min_experience) };
    }
    
    // Filter by maximum hourly rate
    if (max_hourly_rate) {
      profileWhere.hourly_rate = { [Op.lte]: parseFloat(max_hourly_rate) };
    }
    
    // Determine sort field and order
    let order = [[sort_by, sort_order]];
    if (sort_by === 'experience' || sort_by === 'hourly_rate') {
      order = [['tutorProfile', sort_by, sort_order]];
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
      order: order
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

/**
 * Get a tutor by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTutorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find tutor by ID
    const tutor = await User.findOne({
      where: { 
        id,
        role: 'tutor'
      },
      attributes: { exclude: ['password'] },
      include: [{
        model: TutorProfile,
        as: 'tutorProfile'
      }]
    });
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Get tutor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting tutor',
      error: error.message
    });
  }
};

/**
 * Create a new tutor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTutor = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      profile_image,
      bio,
      specialization,
      experience,
      hourly_rate
    } = req.body;
    
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
      // Create new user with tutor role
      const tutor = await User.create({
        email,
        password,
        first_name,
        last_name,
        profile_image,
        role: 'tutor'
      }, { transaction });
      
      // Create tutor profile
      const tutorProfile = await TutorProfile.create({
        user_id: tutor.id,
        bio,
        specialization,
        experience,
        hourly_rate
      }, { transaction });
      
      // Commit the transaction
      await transaction.commit();
      
      // Get the created tutor with profile
      const createdTutor = await User.findByPk(tutor.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: TutorProfile,
          as: 'tutorProfile'
        }]
      });
      
      res.status(201).json({
        success: true,
        message: 'Tutor created successfully',
        data: createdTutor
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create tutor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating tutor',
      error: error.message
    });
  }
};

/**
 * Update a tutor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, 
      last_name, 
      profile_image,
      bio,
      specialization,
      experience,
      hourly_rate
    } = req.body;
    
    // Find tutor by ID
    const tutor = await User.findOne({
      where: { 
        id,
        role: 'tutor'
      },
      include: [{
        model: TutorProfile,
        as: 'tutorProfile'
      }]
    });
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }
    
    // Check if user is authorized to update this tutor
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this tutor'
      });
    }
    
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
            where: { id },
            transaction
          }
        );
      }
      
      // Update tutor profile
      if (bio || specialization || experience || hourly_rate) {
        await TutorProfile.update(
          {
            bio: bio || undefined,
            specialization: specialization || undefined,
            experience: experience !== undefined ? experience : undefined,
            hourly_rate: hourly_rate !== undefined ? hourly_rate : undefined
          },
          {
            where: { user_id: id },
            transaction
          }
        );
      }
      
      // Commit the transaction
      await transaction.commit();
      
      // Get the updated tutor
      const updatedTutor = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: TutorProfile,
          as: 'tutorProfile'
        }]
      });
      
      res.status(200).json({
        success: true,
        message: 'Tutor updated successfully',
        data: updatedTutor
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update tutor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tutor',
      error: error.message
    });
  }
};

/**
 * Delete a tutor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTutor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find tutor by ID
    const tutor = await User.findOne({
      where: { 
        id,
        role: 'tutor'
      }
    });
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }
    
    // Only admins can delete tutors
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete tutors'
      });
    }
    
    // Start a transaction
    const transaction = await db.sequelize.transaction();
    
    try {
      // Delete tutor profile
      await TutorProfile.destroy({
        where: { user_id: id },
        transaction
      });
      
      // Delete user
      await User.destroy({
        where: { id },
        transaction
      });
      
      // Commit the transaction
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Tutor deleted successfully'
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete tutor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tutor',
      error: error.message
    });
  }
};

module.exports = {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor
};
