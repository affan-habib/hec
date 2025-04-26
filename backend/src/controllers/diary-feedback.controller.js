const db = require('../models');
const { DiaryFeedback, DiaryPage, Diary, User } = db;
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination.utils');

/**
 * Create or update feedback for a diary page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createOrUpdateFeedback = async (req, res) => {
  try {
    const { diary_page_id, feedback, marks } = req.body;
    const tutor_id = req.user.id;

    // Check if diary page exists
    const diaryPage = await DiaryPage.findById(parseInt(diary_page_id));

    if (!diaryPage) {
      return res.status(404).json({
        success: false,
        message: 'Diary page not found'
      });
    }

    // Check if user is a tutor or admin
    if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only tutors and admins can provide feedback'
      });
    }

    // Check if feedback already exists for this page and tutor
    let existingFeedback = await DiaryFeedback.findOne({
      where: {
        diary_page_id: parseInt(diary_page_id),
        tutor_id
      }
    });

    let result;
    if (existingFeedback) {
      // Update existing feedback
      await existingFeedback.update({
        feedback,
        marks
      });
      result = await DiaryFeedback.findByPageId(parseInt(diary_page_id));
      
      res.status(200).json({
        success: true,
        message: 'Feedback updated successfully',
        data: {
          feedback: result
        }
      });
    } else {
      // Create new feedback
      result = await DiaryFeedback.create({
        diary_page_id: parseInt(diary_page_id),
        tutor_id,
        feedback,
        marks
      });

      // Get the created feedback with tutor details
      const createdFeedback = await DiaryFeedback.findByPageId(parseInt(diary_page_id));
      
      res.status(201).json({
        success: true,
        message: 'Feedback created successfully',
        data: {
          feedback: createdFeedback
        }
      });
    }
  } catch (error) {
    console.error('Create/update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating feedback',
      error: error.message
    });
  }
};

/**
 * Get feedback for a diary page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFeedbackByPageId = async (req, res) => {
  try {
    const { diary_page_id } = req.params;

    // Check if diary page exists
    const diaryPage = await DiaryPage.findById(parseInt(diary_page_id));

    if (!diaryPage) {
      return res.status(404).json({
        success: false,
        message: 'Diary page not found'
      });
    }

    // Get the diary to check permissions
    const diary = await Diary.findById(diaryPage.diary_id);

    // Check if user has access to the diary
    if (!diary.is_public && diary.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'tutor') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this diary page feedback'
      });
    }

    // Get feedback for the diary page
    const feedback = await DiaryFeedback.findByPageId(parseInt(diary_page_id));

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this diary page'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        feedback
      }
    });
  } catch (error) {
    console.error('Get feedback by page ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting feedback',
      error: error.message
    });
  }
};

/**
 * Get all feedback provided by a tutor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFeedbackByTutorId = async (req, res) => {
  try {
    const { tutor_id } = req.params;
    
    // Check if tutor exists
    const tutor = await User.findOne({
      where: {
        id: parseInt(tutor_id),
        role: 'tutor'
      }
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Check if user has permission to view this tutor's feedback
    if (req.user.id !== parseInt(tutor_id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this tutor\'s feedback'
      });
    }

    // Get pagination parameters
    const pagination = getPaginationParams(req.query);

    // Get all feedback by the tutor
    const feedbacks = await DiaryFeedback.findByTutorId(
      parseInt(tutor_id),
      pagination ? pagination.limit : null,
      pagination ? pagination.offset : 0
    );

    // Get total count for pagination metadata
    const totalCount = await DiaryFeedback.countByTutorId(parseInt(tutor_id));

    res.status(200).json({
      success: true,
      data: {
        feedbacks,
        ...getPaginationMetadata(pagination, totalCount)
      }
    });
  } catch (error) {
    console.error('Get feedback by tutor ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting feedback',
      error: error.message
    });
  }
};

/**
 * Delete feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists
    const feedback = await DiaryFeedback.findByPk(parseInt(id), {
      include: [{
        model: User,
        as: 'tutor',
        attributes: ['id', 'role']
      }]
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user has permission to delete this feedback
    if (req.user.id !== feedback.tutor_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this feedback'
      });
    }

    // Delete the feedback
    await feedback.destroy();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback',
      error: error.message
    });
  }
};

module.exports = {
  createOrUpdateFeedback,
  getFeedbackByPageId,
  getFeedbackByTutorId,
  deleteFeedback
};
