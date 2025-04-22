const Diary = require('../models/diary.model');

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
    const { public_only, user_id, limit = 10, offset = 0 } = req.query;

    // Convert string parameters to appropriate types
    const publicOnly = public_only === 'true';
    const userId = user_id ? parseInt(user_id) : null;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

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

    const diaries = await Diary.getAll(effectivePublicOnly, effectiveUserId, limitNum, offsetNum);

    res.status(200).json({
      success: true,
      data: {
        diaries,
        count: diaries.length,
        limit: limitNum,
        offset: offsetNum
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

module.exports = {
  createDiary,
  getAllDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary
};
