const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');
const { query } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', 
  authenticate, 
  isAdmin, 
  analyticsController.getDashboardStats
);

// Get user growth data
router.get('/users/growth', 
  authenticate, 
  isAdmin, 
  [
    query('period').optional().isIn(['week', 'month', 'year']).withMessage('Period must be one of: week, month, year')
  ],
  validate,
  analyticsController.getUserGrowth
);

// Get activity distribution data
router.get('/activity/distribution', 
  authenticate, 
  isAdmin, 
  analyticsController.getActivityDistribution
);

// Get asset usage data
router.get('/assets/usage', 
  authenticate, 
  isAdmin, 
  [
    query('period').optional().isIn(['week', 'month', 'year']).withMessage('Period must be one of: week, month, year')
  ],
  validate,
  analyticsController.getAssetUsage
);

// Get top assets
router.get('/assets/top', 
  authenticate, 
  isAdmin, 
  [
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
  ],
  validate,
  analyticsController.getTopAssets
);

// Get top asset categories
router.get('/assets/categories/top', 
  authenticate, 
  isAdmin, 
  [
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
  ],
  validate,
  analyticsController.getTopCategories
);

// Get revenue statistics
router.get('/revenue', 
  authenticate, 
  isAdmin, 
  [
    query('period').optional().isIn(['week', 'month', 'year']).withMessage('Period must be one of: week, month, year')
  ],
  validate,
  analyticsController.getRevenueStats
);

// Get recent activities
router.get('/activities/recent', 
  authenticate, 
  isAdmin, 
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  validate,
  analyticsController.getRecentActivities
);

module.exports = router;
