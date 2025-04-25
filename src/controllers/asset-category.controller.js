const db = require('../models');
const { AssetCategory, Asset } = db;
const { Op } = db.Sequelize;
const { getPaginationParams, getPaginationMetadata, applyPagination } = require('../utils/pagination.utils');

/**
 * Get all asset categories with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllAssetCategories = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const {
      name,
      is_active,
      sort_by = 'display_order',
      sort_order = 'ASC'
    } = req.query;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Build the where clause for filtering
    const where = {};
    
    // Filter by name if provided
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    
    // Filter by active status if provided
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }
    
    // Determine the order
    let order = [[sort_by, sort_order]];
    
    // Prepare query options
    let queryOptions = {
      where,
      order: order
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all asset categories
    const { count, rows: categories } = await AssetCategory.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        categories,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get all asset categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting asset categories',
      error: error.message
    });
  }
};

/**
 * Get an asset category by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAssetCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await AssetCategory.findByPk(id, {
      include: [
        {
          model: Asset,
          as: 'assets',
          where: { is_active: true },
          required: false
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get asset category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting asset category',
      error: error.message
    });
  }
};

/**
 * Create a new asset category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createAssetCategory = async (req, res) => {
  try {
    const { name, description, display_order, is_active } = req.body;
    
    // Check if category with the same name already exists
    const existingCategory = await AssetCategory.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Asset category with this name already exists'
      });
    }
    
    const category = await AssetCategory.create({
      name,
      description,
      display_order,
      is_active
    });
    
    res.status(201).json({
      success: true,
      message: 'Asset category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating asset category',
      error: error.message
    });
  }
};

/**
 * Update an asset category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAssetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, display_order, is_active } = req.body;
    
    // Check if category exists
    const category = await AssetCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found'
      });
    }
    
    // Check if another category with the same name exists
    if (name && name !== category.name) {
      const existingCategory = await AssetCategory.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Another asset category with this name already exists'
        });
      }
    }
    
    // Update category
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      display_order: display_order !== undefined ? display_order : category.display_order,
      is_active: is_active !== undefined ? is_active : category.is_active
    });
    
    res.status(200).json({
      success: true,
      message: 'Asset category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating asset category',
      error: error.message
    });
  }
};

/**
 * Delete an asset category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAssetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const category = await AssetCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found'
      });
    }
    
    // Check if category has assets
    const assetCount = await Asset.count({ where: { category_id: id } });
    if (assetCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with associated assets. Please delete or reassign assets first.'
      });
    }
    
    // Delete category
    await category.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Asset category deleted successfully'
    });
  } catch (error) {
    console.error('Delete asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset category',
      error: error.message
    });
  }
};

module.exports = {
  getAllAssetCategories,
  getAssetCategoryById,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory
};
