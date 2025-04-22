const db = require('../models');
const { User, StudentProfile } = db;
const { Op } = db.Sequelize;

/**
 * Get all students with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllStudents = async (req, res) => {
  try {
    // Get query parameters for pagination and filtering
    const { 
      page = 1, 
      limit = 10, 
      name,
      level,
      sort_by = 'first_name',
      sort_order = 'ASC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build the where clause for filtering
    const studentWhere = { role: 'student' };
    const profileWhere = {};
    
    // Filter by name (first_name or last_name)
    if (name) {
      studentWhere[Op.or] = [
        { first_name: { [Op.like]: `%${name}%` } },
        { last_name: { [Op.like]: `%${name}%` } }
      ];
    }
    
    // Filter by level
    if (level) {
      profileWhere.level = level;
    }
    
    // Determine sort field and order
    let order = [[sort_by, sort_order]];
    if (sort_by === 'level') {
      order = [['studentProfile', sort_by, sort_order]];
    }
    
    // Find all students with their profiles
    const { count, rows: students } = await User.findAndCountAll({
      where: studentWhere,
      attributes: { exclude: ['password'] },
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        where: Object.keys(profileWhere).length > 0 ? profileWhere : undefined
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: order
    });
    
    res.status(200).json({
      success: true,
      data: {
        students,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting students',
      error: error.message
    });
  }
};

/**
 * Get a student by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find student by ID
    const student = await User.findOne({
      where: { 
        id,
        role: 'student'
      },
      attributes: { exclude: ['password'] },
      include: [{
        model: StudentProfile,
        as: 'studentProfile'
      }]
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting student',
      error: error.message
    });
  }
};

/**
 * Create a new student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createStudent = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      profile_image,
      level,
      learning_goals,
      interests
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
      // Create new user with student role
      const student = await User.create({
        email,
        password,
        first_name,
        last_name,
        profile_image,
        role: 'student'
      }, { transaction });
      
      // Create student profile
      const studentProfile = await StudentProfile.create({
        user_id: student.id,
        level,
        learning_goals,
        interests
      }, { transaction });
      
      // Commit the transaction
      await transaction.commit();
      
      // Get the created student with profile
      const createdStudent = await User.findByPk(student.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: StudentProfile,
          as: 'studentProfile'
        }]
      });
      
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: createdStudent
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

/**
 * Update a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, 
      last_name, 
      profile_image,
      level,
      learning_goals,
      interests
    } = req.body;
    
    // Find student by ID
    const student = await User.findOne({
      where: { 
        id,
        role: 'student'
      },
      include: [{
        model: StudentProfile,
        as: 'studentProfile'
      }]
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if user is authorized to update this student
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this student'
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
      
      // Update student profile
      if (level || learning_goals || interests) {
        await StudentProfile.update(
          {
            level: level || undefined,
            learning_goals: learning_goals || undefined,
            interests: interests || undefined
          },
          {
            where: { user_id: id },
            transaction
          }
        );
      }
      
      // Commit the transaction
      await transaction.commit();
      
      // Get the updated student
      const updatedStudent = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: StudentProfile,
          as: 'studentProfile'
        }]
      });
      
      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

/**
 * Delete a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find student by ID
    const student = await User.findOne({
      where: { 
        id,
        role: 'student'
      }
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Only admins can delete students
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete students'
      });
    }
    
    // Start a transaction
    const transaction = await db.sequelize.transaction();
    
    try {
      // Delete student profile
      await StudentProfile.destroy({
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
        message: 'Student deleted successfully'
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
