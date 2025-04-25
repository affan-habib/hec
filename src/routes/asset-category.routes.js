const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const assetCategoryController = require('../controllers/asset-category.controller');
const { body, param, query } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Get all asset categories
router.get('/',
  authenticate,
  [
    query('page').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('name').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Name must be a string'),
    query('is_active').optional({ nullable: true, checkFalsy: true }).isBoolean().withMessage('Is active must be a boolean'),
    query('sort_by').optional({ nullable: true, checkFalsy: true }).isIn(['name', 'display_order', 'created_at']).withMessage('Sort by must be one of: name, display_order, created_at'),
    query('sort_order').optional({ nullable: true, checkFalsy: true }).isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
  ],
  validate,
  assetCategoryController.getAllAssetCategories
);

// Get an asset category by ID
router.get('/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Asset category ID must be an integer')
  ],
  validate,
  assetCategoryController.getAssetCategoryById
);

// Create a new asset category (admin only)
router.post('/',
  authenticate,
  isAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
    body('display_order').optional().isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
    body('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
  ],
  validate,
  assetCategoryController.createAssetCategory
);

// Update an asset category (admin only)
router.put('/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('Asset category ID must be an integer'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional(),
    body('display_order').optional().isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
    body('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
  ],
  validate,
  assetCategoryController.updateAssetCategory
);

// Delete an asset category (admin only)
router.delete('/:id',
  authenticate,
  isAdmin,
  [
    param('id').isInt().withMessage('Asset category ID must be an integer')
  ],
  validate,
  assetCategoryController.deleteAssetCategory
);

module.exports = router;
