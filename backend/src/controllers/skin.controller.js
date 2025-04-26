const db = require('../models');
const { Skin } = db;
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination.utils');

/**
 * Create a new skin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSkin = async (req, res) => {
  try {
    const { name, description, theme_data, is_public } = req.body;
    const created_by = req.user.id;

    const skin = await Skin.create({
      name,
      description,
      theme_data,
      created_by,
      is_public
    });

    res.status(201).json({
      success: true,
      message: 'Skin created successfully',
      data: {
        skin
      }
    });
  } catch (error) {
    console.error('Create skin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating skin',
      error: error.message
    });
  }
};

/**
 * Get all skins
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSkins = async (req, res) => {
  try {
    const { public_only, user_id } = req.query;

    // Convert string parameters to appropriate types
    let publicOnly = false;
    let userId = null;

    // Handle public_only parameter
    if (public_only !== undefined && public_only !== '') {
      publicOnly = public_only === 'true' || public_only === true;
    }

    // Handle user_id parameter
    if (user_id !== undefined && user_id !== '') {
      userId = parseInt(user_id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              field: 'user_id',
              message: 'User ID must be an integer'
            }
          ]
        });
      }
    }

    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);

    // Get skins with pagination
    const skins = await Skin.getAll(
      publicOnly,
      userId,
      pagination ? pagination.limit : null,
      pagination ? pagination.offset : 0
    );

    // Get total count for pagination metadata
    const totalCount = await Skin.countAll(publicOnly, userId);

    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        skins,
        ...getPaginationMetadata(pagination, totalCount)
      }
    });
  } catch (error) {
    console.error('Get all skins error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting skins',
      error: error.message
    });
  }
};

/**
 * Get a skin by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSkinById = async (req, res) => {
  try {
    const { id } = req.params;

    const skin = await Skin.findById(parseInt(id));

    if (!skin) {
      return res.status(404).json({
        success: false,
        message: 'Skin not found'
      });
    }

    // Check if user has access to the skin
    if (!skin.is_public && skin.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this skin'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        skin
      }
    });
  } catch (error) {
    console.error('Get skin by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting skin',
      error: error.message
    });
  }
};

/**
 * Update a skin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateSkin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, theme_data, is_public } = req.body;

    // Check if skin exists
    const existingSkin = await Skin.findById(parseInt(id));

    if (!existingSkin) {
      return res.status(404).json({
        success: false,
        message: 'Skin not found'
      });
    }

    // Check if user has permission to update the skin
    if (existingSkin.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this skin'
      });
    }

    const updatedSkin = await Skin.updateById(parseInt(id), {
      name,
      description,
      theme_data,
      is_public
    });

    res.status(200).json({
      success: true,
      message: 'Skin updated successfully',
      data: {
        skin: updatedSkin
      }
    });
  } catch (error) {
    console.error('Update skin error:', error);
    console.error('Error details:', {
      id: req.params.id,
      body: req.body,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Error updating skin',
      error: error.message
    });
  }
};

/**
 * Delete a skin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSkin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if skin exists
    const existingSkin = await Skin.findById(parseInt(id));

    if (!existingSkin) {
      return res.status(404).json({
        success: false,
        message: 'Skin not found'
      });
    }

    // Check if user has permission to delete the skin
    if (existingSkin.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this skin'
      });
    }

    await Skin.delete(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Skin deleted successfully'
    });
  } catch (error) {
    console.error('Delete skin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting skin',
      error: error.message
    });
  }
};

module.exports = {
  createSkin,
  getAllSkins,
  getSkinById,
  updateSkin,
  deleteSkin
};
