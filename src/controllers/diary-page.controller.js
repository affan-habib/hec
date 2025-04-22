const DiaryPage = require('../models/diary-page.model');
const Diary = require('../models/diary.model');
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination.utils');

/**
 * Create a new diary page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDiaryPage = async (req, res) => {
  try {
    const { diary_id, title, content, skin_id } = req.body;

    // Check if diary exists and user has access to it
    const diary = await Diary.findById(diary_id);

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    // Check if user has permission to add pages to this diary
    if (diary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add pages to this diary'
      });
    }

    // Get the next available page number
    const page_number = await DiaryPage.getNextPageNumber(diary_id);

    // Create the diary page
    const page = await DiaryPage.create({
      diary_id,
      title,
      content,
      page_number,
      skin_id
    });

    res.status(201).json({
      success: true,
      message: 'Diary page created successfully',
      data: {
        page
      }
    });
  } catch (error) {
    console.error('Create diary page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating diary page',
      error: error.message
    });
  }
};

/**
 * Get all pages for a diary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllDiaryPages = async (req, res) => {
  try {
    const { diary_id } = req.params;

    // Check if diary exists
    const diary = await Diary.findById(parseInt(diary_id));

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

    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);

    // Get all pages for the diary with pagination
    const pages = await DiaryPage.getAllByDiaryId(
      parseInt(diary_id),
      pagination ? pagination.limit : null,
      pagination ? pagination.offset : 0
    );

    // Get total count for pagination metadata
    const totalCount = await DiaryPage.countByDiaryId(parseInt(diary_id));

    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        diary,
        pages,
        ...getPaginationMetadata(pagination, totalCount)
      }
    });
  } catch (error) {
    console.error('Get all diary pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting diary pages',
      error: error.message
    });
  }
};

/**
 * Get a diary page by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDiaryPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await DiaryPage.findById(parseInt(id));

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Diary page not found'
      });
    }

    // Get the diary to check permissions
    const diary = await Diary.findById(page.diary_id);

    // Check if user has access to the diary
    if (!diary.is_public && diary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this diary page'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        page
      }
    });
  } catch (error) {
    console.error('Get diary page by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting diary page',
      error: error.message
    });
  }
};

/**
 * Update a diary page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDiaryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, skin_id } = req.body;

    // Check if page exists
    const existingPage = await DiaryPage.findById(parseInt(id));

    if (!existingPage) {
      return res.status(404).json({
        success: false,
        message: 'Diary page not found'
      });
    }

    // Get the diary to check permissions
    const diary = await Diary.findById(existingPage.diary_id);

    // Check if user has permission to update the diary page
    if (diary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this diary page'
      });
    }

    const updatedPage = await DiaryPage.update(parseInt(id), {
      title,
      content,
      skin_id
    });

    res.status(200).json({
      success: true,
      message: 'Diary page updated successfully',
      data: {
        page: updatedPage
      }
    });
  } catch (error) {
    console.error('Update diary page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating diary page',
      error: error.message
    });
  }
};

/**
 * Delete a diary page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDiaryPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if page exists
    const existingPage = await DiaryPage.findById(parseInt(id));

    if (!existingPage) {
      return res.status(404).json({
        success: false,
        message: 'Diary page not found'
      });
    }

    // Get the diary to check permissions
    const diary = await Diary.findById(existingPage.diary_id);

    // Check if user has permission to delete the diary page
    if (diary.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this diary page'
      });
    }

    await DiaryPage.delete(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Diary page deleted successfully'
    });
  } catch (error) {
    console.error('Delete diary page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting diary page',
      error: error.message
    });
  }
};

module.exports = {
  createDiaryPage,
  getAllDiaryPages,
  getDiaryPageById,
  updateDiaryPage,
  deleteDiaryPage
};
