const db = require('../models');
const { Asset, AssetCategory, UserAsset, User } = db;
const { Op } = db.Sequelize;
const { getPaginationParams, getPaginationMetadata, applyPagination } = require('../utils/pagination.utils');

/**
 * Get all assets with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllAssets = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const {
      name,
      category_id,
      is_premium,
      is_free,
      min_price,
      max_price,
      min_points,
      max_points,
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
    
    // Filter by category if provided
    if (category_id) {
      where.category_id = category_id;
    }
    
    // Filter by premium status if provided
    if (is_premium !== undefined) {
      where.is_premium = is_premium === 'true';
    }
    
    // Filter by free status if provided
    if (is_free !== undefined) {
      where.is_free = is_free === 'true';
    }
    
    // Filter by price range if provided
    if (min_price !== undefined || max_price !== undefined) {
      where.price = {};
      if (min_price !== undefined) {
        where.price[Op.gte] = parseFloat(min_price);
      }
      if (max_price !== undefined) {
        where.price[Op.lte] = parseFloat(max_price);
      }
    }
    
    // Filter by points range if provided
    if (min_points !== undefined || max_points !== undefined) {
      where.points_required = {};
      if (min_points !== undefined) {
        where.points_required[Op.gte] = parseInt(min_points);
      }
      if (max_points !== undefined) {
        where.points_required[Op.lte] = parseInt(max_points);
      }
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
      include: [
        {
          model: AssetCategory,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: order
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all assets
    const { count, rows: assets } = await Asset.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        assets,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get all assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting assets',
      error: error.message
    });
  }
};

/**
 * Get an asset by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const asset = await Asset.findByPk(id, {
      include: [
        {
          model: AssetCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Get asset by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting asset',
      error: error.message
    });
  }
};

/**
 * Create a new asset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createAsset = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      image_url,
      thumbnail_url,
      price,
      is_premium,
      is_free,
      points_required,
      display_order,
      is_active
    } = req.body;
    
    // Check if category exists
    const category = await AssetCategory.findByPk(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found'
      });
    }
    
    // Validate pricing logic
    if (is_free && (price > 0 || points_required > 0)) {
      return res.status(400).json({
        success: false,
        message: 'Free assets cannot have a price or points requirement'
      });
    }
    
    if (!is_free && price <= 0 && points_required <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Non-free assets must have either a price or points requirement'
      });
    }
    
    const asset = await Asset.create({
      name,
      description,
      category_id,
      image_url,
      thumbnail_url,
      price: price || 0,
      is_premium: is_premium || false,
      is_free: is_free || false,
      points_required: points_required || 0,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true
    });
    
    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating asset',
      error: error.message
    });
  }
};

/**
 * Update an asset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category_id,
      image_url,
      thumbnail_url,
      price,
      is_premium,
      is_free,
      points_required,
      display_order,
      is_active
    } = req.body;
    
    // Check if asset exists
    const asset = await Asset.findByPk(id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    // Check if category exists if provided
    if (category_id) {
      const category = await AssetCategory.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Asset category not found'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (price !== undefined) updateData.price = price;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (is_free !== undefined) updateData.is_free = is_free;
    if (points_required !== undefined) updateData.points_required = points_required;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    // Validate pricing logic
    const isFree = is_free !== undefined ? is_free : asset.is_free;
    const assetPrice = price !== undefined ? price : asset.price;
    const assetPoints = points_required !== undefined ? points_required : asset.points_required;
    
    if (isFree && (assetPrice > 0 || assetPoints > 0)) {
      return res.status(400).json({
        success: false,
        message: 'Free assets cannot have a price or points requirement'
      });
    }
    
    if (!isFree && assetPrice <= 0 && assetPoints <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Non-free assets must have either a price or points requirement'
      });
    }
    
    // Update asset
    await asset.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating asset',
      error: error.message
    });
  }
};

/**
 * Delete an asset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if asset exists
    const asset = await Asset.findByPk(id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    // Check if asset is used by any users
    const userAssetCount = await UserAsset.count({ where: { asset_id: id } });
    if (userAssetCount > 0) {
      // Instead of preventing deletion, we can mark it as inactive
      await asset.update({ is_active: false });
      
      return res.status(200).json({
        success: true,
        message: 'Asset has been marked as inactive because it is in use by users'
      });
    }
    
    // Delete asset
    await asset.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset',
      error: error.message
    });
  }
};

/**
 * Get all assets for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserAssets = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prepare query options
    let queryOptions = {
      where: { user_id, is_active: true },
      include: [
        {
          model: Asset,
          as: 'asset',
          include: [
            {
              model: AssetCategory,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['purchased_at', 'DESC']]
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all user assets
    const { count, rows: userAssets } = await UserAsset.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        userAssets,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get user assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user assets',
      error: error.message
    });
  }
};

/**
 * Assign an asset to a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const assignAssetToUser = async (req, res) => {
  try {
    const { user_id, asset_id, purchase_price, points_spent } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if asset exists
    const asset = await Asset.findByPk(asset_id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    // Check if asset is active
    if (!asset.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Asset is not active'
      });
    }
    
    // Check if user already has this asset
    const existingUserAsset = await UserAsset.findOne({
      where: {
        user_id,
        asset_id
      }
    });
    
    if (existingUserAsset) {
      return res.status(400).json({
        success: false,
        message: 'User already has this asset'
      });
    }
    
    // Create user asset
    const userAsset = await UserAsset.create({
      user_id,
      asset_id,
      purchased_at: new Date(),
      purchase_price: purchase_price || asset.price,
      points_spent: points_spent || asset.points_required,
      is_active: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Asset assigned to user successfully',
      data: userAsset
    });
  } catch (error) {
    console.error('Assign asset to user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning asset to user',
      error: error.message
    });
  }
};

/**
 * Remove an asset from a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeAssetFromUser = async (req, res) => {
  try {
    const { user_id, asset_id } = req.params;
    
    // Check if user asset exists
    const userAsset = await UserAsset.findOne({
      where: {
        user_id,
        asset_id
      }
    });
    
    if (!userAsset) {
      return res.status(404).json({
        success: false,
        message: 'User does not have this asset'
      });
    }
    
    // Delete user asset
    await userAsset.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Asset removed from user successfully'
    });
  } catch (error) {
    console.error('Remove asset from user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing asset from user',
      error: error.message
    });
  }
};

/**
 * Get assets by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAssetsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    
    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);
    
    // Check if category exists
    const category = await AssetCategory.findByPk(category_id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found'
      });
    }
    
    // Prepare query options
    let queryOptions = {
      where: { 
        category_id,
        is_active: true
      },
      order: [['display_order', 'ASC'], ['name', 'ASC']]
    };
    
    // Apply pagination if enabled
    queryOptions = applyPagination(queryOptions, pagination);
    
    // Find all assets in the category
    const { count, rows: assets } = await Asset.findAndCountAll(queryOptions);
    
    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        category,
        assets,
        ...getPaginationMetadata(pagination, count)
      }
    });
  } catch (error) {
    console.error('Get assets by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting assets by category',
      error: error.message
    });
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getUserAssets,
  assignAssetToUser,
  removeAssetFromUser,
  getAssetsByCategory
};
