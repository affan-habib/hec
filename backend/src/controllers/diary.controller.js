const db = require('../models');
const { Diary } = db;
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination.utils');

/**
 * Create a new diary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDiary = async (req, res) => {
  try {
    const { title, description, is_public } = req.body;
    const user_id = req.user.id;

    const diary = await Diary.create({
      user_id,
      title,
      description,
      is_public
    });

    res.status(201).json({
      success: true,
      message: 'Diary created successfully',
      data: {
        diary
      }
    });
  } catch (error) {
    console.error('Create diary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating diary',
      error: error.message
    });
  }
};

/**
 * Get all diaries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllDiaries = async (req, res) => {
  try {
    const { public_only, user_id } = req.query;

    // Convert string parameters to appropriate types
    const publicOnly = public_only === 'true';
    const userId = user_id ? parseInt(user_id) : null;

    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);

    // If not admin and trying to get other user's private diaries, restrict to public only
    let effectivePublicOnly = publicOnly;
    let effectiveUserId = userId;

    if (req.user.role !== 'admin' && userId !== req.user.id) {
      effectivePublicOnly = true;
    }

    // If no user_id specified and not admin, default to current user's diaries
    if (!userId && req.user.role !== 'admin') {
      effectiveUserId = req.user.id;
    }

    // If pagination is disabled, get all diaries
    const diaries = await Diary.getAll(
      effectivePublicOnly,
      effectiveUserId,
      pagination ? pagination.limit : null,
      pagination ? pagination.offset : 0
    );

    // Get total count for pagination metadata
    const totalCount = await Diary.countAll(effectivePublicOnly, effectiveUserId);

    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        diaries,
        ...getPaginationMetadata(pagination, totalCount)
      }
    });
  } catch (error) {
    console.error('Get all diaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting diaries',
      error: error.message
    });
  }
};

/**
 * Get a diary by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDiaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { include_pages } = req.query;

    // Convert string parameters to appropriate types
    const includePages = include_pages === 'true';

    const diary = await Diary.findById(parseInt(id), includePages);

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    // Check if user has access to the diary
    if (!diary.is_public && diary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this diary'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        diary
      }
    });
  } catch (error) {
    console.error('Get diary by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting diary',
      error: error.message
    });
  }
};

/**
 * Update a diary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, is_public } = req.body;

    // Check if diary exists
    const existingDiary = await Diary.findById(parseInt(id));

    if (!existingDiary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    // Check if user has permission to update the diary
    if (existingDiary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this diary'
      });
    }

    const updatedDiary = await Diary.update(parseInt(id), {
      title,
      description,
      is_public
    });

    res.status(200).json({
      success: true,
      message: 'Diary updated successfully',
      data: {
        diary: updatedDiary
      }
    });
  } catch (error) {
    console.error('Update diary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating diary',
      error: error.message
    });
  }
};

/**
 * Delete a diary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if diary exists
    const existingDiary = await Diary.findById(parseInt(id));

    if (!existingDiary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    // Check if user has permission to delete the diary
    if (existingDiary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this diary'
      });
    }

    await Diary.delete(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Diary deleted successfully'
    });
  } catch (error) {
    console.error('Delete diary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting diary',
      error: error.message
    });
  }
};

/**
 * Assign a tutor to a diary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const assignTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { tutor_id } = req.body;

    // Check if diary exists
    const existingDiary = await Diary.findById(parseInt(id));

    if (!existingDiary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    // Check if user has permission to update the diary
    if (existingDiary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this diary'
      });
    }

    // If tutor_id is provided, check if tutor exists
    if (tutor_id !== null) {
      const tutor = await db.User.findOne({
        where: {
          id: tutor_id,
          role: 'tutor'
        }
      });

      if (!tutor) {
        return res.status(404).json({
          success: false,
          message: 'Tutor not found'
        });
      }
    }

    // Update the diary with the tutor_id
    // Note: We need to add tutor_id to the Diary model first
    await db.sequelize.query(
      `UPDATE diaries SET tutor_id = ?, updated_at = NOW() WHERE id = ?`,
      {
        replacements: [tutor_id, id]
      }
    );

    // Get the updated diary with tutor information
    const updatedDiary = await db.sequelize.query(
      `SELECT d.*,
        u.id as user_id, u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email,
        t.id as tutor_id, t.first_name as tutor_first_name, t.last_name as tutor_last_name, t.email as tutor_email
      FROM diaries d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN users t ON d.tutor_id = t.id
      WHERE d.id = ?`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT
      }
    );

    if (!updatedDiary || updatedDiary.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found after update'
      });
    }

    // Format the response
    const diary = updatedDiary[0];
    const formattedDiary = {
      id: diary.id,
      title: diary.title,
      description: diary.description,
      is_public: diary.is_public,
      created_at: diary.created_at,
      updated_at: diary.updated_at,
      user: {
        id: diary.user_id,
        first_name: diary.user_first_name,
        last_name: diary.user_last_name,
        email: diary.user_email
      },
      tutor: diary.tutor_id ? {
        id: diary.tutor_id,
        first_name: diary.tutor_first_name,
        last_name: diary.tutor_last_name,
        email: diary.tutor_email
      } : null
    };

    res.status(200).json({
      success: true,
      message: tutor_id ? 'Tutor assigned successfully' : 'Tutor unassigned successfully',
      data: formattedDiary
    });
  } catch (error) {
    console.error('Assign tutor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning tutor',
      error: error.message
    });
  }
};

module.exports = {
  createDiary,
  getAllDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
  assignTutor
};
