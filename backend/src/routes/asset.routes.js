const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const assetController = require('../controllers/asset.controller');
const { body, param, query } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Get all assets
router.get('/', 
  authenticate, 
  [
    query('page').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('name').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Name must be a string'),
    query('category_id').optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Category ID must be an integer'),
    query('is_premium').optional({ nullable: true, checkFalsy: true }).isBoolean().withMessage('Is premium must be a boolean'),
    query('is_free').optional({ nullable: true, checkFalsy: true }).isBoolean().withMessage('Is free must be a boolean'),
    query('min_price').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Min price must be a non-negative number'),
    query('max_price').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Max price must be a non-negative number'),
    query('min_points').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Min points must be a non-negative integer'),
    query('max_points').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Max points must be a non-negative integer'),
    query('is_active').optional({ nullable: true, checkFalsy: true }).isBoolean().withMessage('Is active must be a boolean'),
    query('sort_by').optional({ nullable: true, checkFalsy: true }).isIn(['name', 'price', 'points_required', 'display_order', 'created_at']).withMessage('Sort by must be one of: name, price, points_required, display_order, created_at'),
    query('sort_order').optional({ nullable: true, checkFalsy: true }).isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
  ],
  validate,
  assetController.getAllAssets
);

// Get an asset by ID
router.get('/:id', 
  authenticate, 
  [
    param('id').isInt().withMessage('Asset ID must be an integer')
  ],
  validate,
  assetController.getAssetById
);

// Create a new asset (admin only)
router.post('/', 
  authenticate, 
  isAdmin, 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
    body('category_id').notEmpty().isInt().withMessage('Category ID is required and must be an integer'),
    body('image_url').notEmpty().isURL().withMessage('Image URL is required and must be a valid URL'),
    body('thumbnail_url').optional().isURL().withMessage('Thumbnail URL must be a valid URL'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('is_premium').optional().isBoolean().withMessage('Is premium must be a boolean'),
    body('is_free').optional().isBoolean().withMessage('Is free must be a boolean'),
    body('points_required').optional().isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
    body('display_order').optional().isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
    body('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
  ],
  validate,
  assetController.createAsset
);

// Update an asset (admin only)
router.put('/:id', 
  authenticate, 
  isAdmin, 
  [
    param('id').isInt().withMessage('Asset ID must be an integer'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional(),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('thumbnail_url').optional().isURL().withMessage('Thumbnail URL must be a valid URL'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('is_premium').optional().isBoolean().withMessage('Is premium must be a boolean'),
    body('is_free').optional().isBoolean().withMessage('Is free must be a boolean'),
    body('points_required').optional().isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
    body('display_order').optional().isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
    body('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
  ],
  validate,
  assetController.updateAsset
);

// Delete an asset (admin only)
router.delete('/:id', 
  authenticate, 
  isAdmin, 
  [
    param('id').isInt().withMessage('Asset ID must be an integer')
  ],
  validate,
  assetController.deleteAsset
);

// Get assets by category
router.get('/category/:category_id', 
  authenticate, 
  [
    param('category_id').isInt().withMessage('Category ID must be an integer'),
    query('page').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  validate,
  assetController.getAssetsByCategory
);

// Get user assets
router.get('/user/:user_id', 
  authenticate, 
  [
    param('user_id').isInt().withMessage('User ID must be an integer'),
    query('page').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  validate,
  assetController.getUserAssets
);

// Assign asset to user
router.post('/assign', 
  authenticate, 
  isAdmin, 
  [
    body('user_id').notEmpty().isInt().withMessage('User ID is required and must be an integer'),
    body('asset_id').notEmpty().isInt().withMessage('Asset ID is required and must be an integer'),
    body('purchase_price').optional().isFloat({ min: 0 }).withMessage('Purchase price must be a non-negative number'),
    body('points_spent').optional().isInt({ min: 0 }).withMessage('Points spent must be a non-negative integer')
  ],
  validate,
  assetController.assignAssetToUser
);

// Remove asset from user
router.delete('/user/:user_id/asset/:asset_id', 
  authenticate, 
  isAdmin, 
  [
    param('user_id').isInt().withMessage('User ID must be an integer'),
    param('asset_id').isInt().withMessage('Asset ID must be an integer')
  ],
  validate,
  assetController.removeAssetFromUser
);

module.exports = router;
