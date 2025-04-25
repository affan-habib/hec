const db = require('../models');
const { User, Student, Tutor, Diary, DiaryPage, Chat, Award, Forum, Asset, AssetCategory, UserAsset } = db;
const { Op } = db.Sequelize;
const sequelize = db.sequelize;

/**
 * Get dashboard statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for each entity
    const [
      studentsCount,
      previousStudentsCount,
      tutorsCount,
      previousTutorsCount,
      assetsCount,
      previousAssetsCount,
      revenueData,
      previousRevenueData
    ] = await Promise.all([
      // Current students count
      Student.count(),
      
      // Previous period students count (30 days ago)
      Student.count({
        where: {
          created_at: {
            [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Current tutors count
      Tutor.count(),
      
      // Previous period tutors count (30 days ago)
      Tutor.count({
        where: {
          created_at: {
            [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Current assets count
      Asset.count(),
      
      // Previous period assets count (30 days ago)
      Asset.count({
        where: {
          created_at: {
            [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Current revenue (last 30 days)
      UserAsset.sum('purchase_price', {
        where: {
          purchased_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Previous period revenue (30-60 days ago)
      UserAsset.sum('purchase_price', {
        where: {
          purchased_at: {
            [Op.gte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate percent changes
    const studentsPercentChange = previousStudentsCount === 0 
      ? (studentsCount > 0 ? 100 : 0) 
      : ((studentsCount - previousStudentsCount) / previousStudentsCount) * 100;
    
    const tutorsPercentChange = previousTutorsCount === 0 
      ? (tutorsCount > 0 ? 100 : 0) 
      : ((tutorsCount - previousTutorsCount) / previousTutorsCount) * 100;
    
    const assetsPercentChange = previousAssetsCount === 0 
      ? (assetsCount > 0 ? 100 : 0) 
      : ((assetsCount - previousAssetsCount) / previousAssetsCount) * 100;
    
    const revenueAmount = revenueData || 0;
    const previousRevenueAmount = previousRevenueData || 0;
    const revenuePercentChange = previousRevenueAmount === 0 
      ? (revenueAmount > 0 ? 100 : 0) 
      : ((revenueAmount - previousRevenueAmount) / previousRevenueAmount) * 100;

    // Prepare response
    const stats = {
      students: {
        count: studentsCount,
        previousCount: previousStudentsCount,
        percentChange: studentsPercentChange
      },
      tutors: {
        count: tutorsCount,
        previousCount: previousTutorsCount,
        percentChange: tutorsPercentChange
      },
      assets: {
        count: assetsCount,
        previousCount: previousAssetsCount,
        percentChange: assetsPercentChange
      },
      revenue: {
        amount: revenueAmount,
        previousAmount: previousRevenueAmount,
        percentChange: revenuePercentChange
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard stats',
      error: error.message
    });
  }
};

/**
 * Get user growth data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserGrowth = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let interval, limit, dateFormat;
    
    // Set interval and limit based on period
    switch (period) {
      case 'week':
        interval = 'day';
        limit = 7;
        dateFormat = '%Y-%m-%d';
        break;
      case 'year':
        interval = 'month';
        limit = 12;
        dateFormat = '%Y-%m';
        break;
      case 'month':
      default:
        interval = 'day';
        limit = 30;
        dateFormat = '%Y-%m-%d';
        break;
    }

    // Get student growth data
    const studentGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), dateFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        role: 'student',
        created_at: {
          [Op.gte]: sequelize.literal(`DATE_SUB(CURRENT_DATE, INTERVAL ${limit} ${interval})`)
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), dateFormat)],
      order: [[sequelize.col('created_at'), 'ASC']],
      raw: true
    });

    // Get tutor growth data
    const tutorGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), dateFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        role: 'tutor',
        created_at: {
          [Op.gte]: sequelize.literal(`DATE_SUB(CURRENT_DATE, INTERVAL ${limit} ${interval})`)
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), dateFormat)],
      order: [[sequelize.col('created_at'), 'ASC']],
      raw: true
    });

    // Generate date labels
    const labels = [];
    const currentDate = new Date();
    
    if (period === 'week' || period === 'month') {
      for (let i = limit - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split('T')[0]);
      }
    } else if (period === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        labels.push(monthYear);
      }
    }

    // Prepare datasets
    const studentData = new Array(labels.length).fill(0);
    const tutorData = new Array(labels.length).fill(0);
    
    // Fill student data
    studentGrowth.forEach(item => {
      const index = labels.indexOf(item.date);
      if (index !== -1) {
        studentData[index] = parseInt(item.count);
      }
    });
    
    // Fill tutor data
    tutorGrowth.forEach(item => {
      const index = labels.indexOf(item.date);
      if (index !== -1) {
        tutorData[index] = parseInt(item.count);
      }
    });

    // Format labels for display
    const formattedLabels = labels.map(label => {
      if (period === 'week' || period === 'month') {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'year') {
        const [year, month] = label.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      return label;
    });

    // Prepare response
    const data = {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Students',
          data: studentData,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true
        },
        {
          label: 'Tutors',
          data: tutorData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }
      ]
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting user growth:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user growth',
      error: error.message
    });
  }
};

/**
 * Get activity distribution data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getActivityDistribution = async (req, res) => {
  try {
    // Get counts for each activity type
    const [
      chatsCount,
      diaryPagesCount,
      forumPostsCount,
      assetUsageCount,
      awardsCount
    ] = await Promise.all([
      Chat.count(),
      DiaryPage.count(),
      Forum.count(),
      UserAsset.count(),
      Award.count()
    ]);

    // Prepare response
    const data = {
      labels: ['Chats', 'Diaries', 'Forums', 'Asset Usage', 'Awards'],
      values: [chatsCount, diaryPagesCount, forumPostsCount, assetUsageCount, awardsCount],
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6']
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting activity distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting activity distribution',
      error: error.message
    });
  }
};

/**
 * Get asset usage data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAssetUsage = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let interval, limit, dateFormat;
    
    // Set interval and limit based on period
    switch (period) {
      case 'week':
        interval = 'day';
        limit = 7;
        dateFormat = '%Y-%m-%d';
        break;
      case 'year':
        interval = 'month';
        limit = 12;
        dateFormat = '%Y-%m';
        break;
      case 'month':
      default:
        interval = 'day';
        limit = 6; // Last 6 months for better visualization
        dateFormat = '%Y-%m';
        break;
    }

    // Get free asset usage data
    const freeAssetUsage = await UserAsset.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('purchased_at'), dateFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [
        {
          model: Asset,
          as: 'asset',
          attributes: [],
          where: {
            is_free: true
          }
        }
      ],
      where: {
        purchased_at: {
          [Op.gte]: sequelize.literal(`DATE_SUB(CURRENT_DATE, INTERVAL ${limit} ${interval})`)
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('purchased_at'), dateFormat)],
      order: [[sequelize.col('purchased_at'), 'ASC']],
      raw: true
    });

    // Get premium asset usage data
    const premiumAssetUsage = await UserAsset.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('purchased_at'), dateFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [
        {
          model: Asset,
          as: 'asset',
          attributes: [],
          where: {
            is_premium: true
          }
        }
      ],
      where: {
        purchased_at: {
          [Op.gte]: sequelize.literal(`DATE_SUB(CURRENT_DATE, INTERVAL ${limit} ${interval})`)
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('purchased_at'), dateFormat)],
      order: [[sequelize.col('purchased_at'), 'ASC']],
      raw: true
    });

    // Generate date labels
    const labels = [];
    const currentDate = new Date();
    
    if (period === 'week') {
      for (let i = limit - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split('T')[0]);
      }
    } else {
      for (let i = limit - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        labels.push(monthYear);
      }
    }

    // Prepare datasets
    const freeAssetData = new Array(labels.length).fill(0);
    const premiumAssetData = new Array(labels.length).fill(0);
    
    // Fill free asset data
    freeAssetUsage.forEach(item => {
      const index = labels.indexOf(item.date);
      if (index !== -1) {
        freeAssetData[index] = parseInt(item.count);
      }
    });
    
    // Fill premium asset data
    premiumAssetUsage.forEach(item => {
      const index = labels.indexOf(item.date);
      if (index !== -1) {
        premiumAssetData[index] = parseInt(item.count);
      }
    });

    // Format labels for display
    const formattedLabels = labels.map(label => {
      if (period === 'week') {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        const [year, month] = label.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
    });

    // Prepare response
    const data = {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Free Assets',
          data: freeAssetData,
          backgroundColor: '#4F46E5'
        },
        {
          label: 'Premium Assets',
          data: premiumAssetData,
          backgroundColor: '#F59E0B'
        }
      ]
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting asset usage:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting asset usage',
      error: error.message
    });
  }
};

/**
 * Get top assets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTopAssets = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Get top assets by usage count
    const topAssets = await UserAsset.findAll({
      attributes: [
        'asset_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'usage_count']
      ],
      include: [
        {
          model: Asset,
          as: 'asset',
          attributes: ['id', 'name']
        }
      ],
      group: ['asset_id'],
      order: [[sequelize.literal('usage_count'), 'DESC']],
      limit: parseInt(limit),
      raw: true,
      nest: true
    });

    // Prepare response
    const data = {
      labels: topAssets.map(item => item.asset.name),
      values: topAssets.map(item => parseInt(item.usage_count)),
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6']
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting top assets:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting top assets',
      error: error.message
    });
  }
};

/**
 * Get top asset categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTopCategories = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Get top categories by asset usage count
    const topCategories = await UserAsset.findAll({
      attributes: [
        [sequelize.literal('`asset.category_id`'), 'category_id'],
        [sequelize.fn('COUNT', sequelize.col('UserAsset.id')), 'usage_count']
      ],
      include: [
        {
          model: Asset,
          as: 'asset',
          attributes: [],
          include: [
            {
              model: AssetCategory,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      group: [sequelize.literal('`asset.category_id`')],
      order: [[sequelize.literal('usage_count'), 'DESC']],
      limit: parseInt(limit),
      raw: true,
      nest: true
    });

    // Prepare response
    const data = {
      labels: topCategories.map(item => item.asset.category.name),
      values: topCategories.map(item => parseInt(item.usage_count)),
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6']
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting top categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting top categories',
      error: error.message
    });
  }
};

/**
 * Get revenue statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRevenueStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let interval, limit, dateFormat;
    
    // Set interval and limit based on period
    switch (period) {
      case 'week':
        interval = 'day';
        limit = 7;
        dateFormat = '%Y-%m-%d';
        break;
      case 'year':
        interval = 'month';
        limit = 12;
        dateFormat = '%Y-%m';
        break;
      case 'month':
      default:
        interval = 'day';
        limit = 30;
        dateFormat = '%Y-%m-%d';
        break;
    }

    // Get revenue data
    const revenueData = await UserAsset.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('purchased_at'), dateFormat), 'date'],
        [sequelize.fn('SUM', sequelize.col('purchase_price')), 'revenue']
      ],
      where: {
        purchased_at: {
          [Op.gte]: sequelize.literal(`DATE_SUB(CURRENT_DATE, INTERVAL ${limit} ${interval})`)
        },
        purchase_price: {
          [Op.gt]: 0
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('purchased_at'), dateFormat)],
      order: [[sequelize.col('purchased_at'), 'ASC']],
      raw: true
    });

    // Generate date labels
    const labels = [];
    const currentDate = new Date();
    
    if (period === 'week' || period === 'month') {
      for (let i = limit - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split('T')[0]);
      }
    } else if (period === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        labels.push(monthYear);
      }
    }

    // Prepare datasets
    const revenueValues = new Array(labels.length).fill(0);
    
    // Fill revenue data
    revenueData.forEach(item => {
      const index = labels.indexOf(item.date);
      if (index !== -1) {
        revenueValues[index] = parseFloat(item.revenue);
      }
    });

    // Format labels for display
    const formattedLabels = labels.map(label => {
      if (period === 'week' || period === 'month') {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'year') {
        const [year, month] = label.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      return label;
    });

    // Calculate total revenue
    const totalRevenue = revenueValues.reduce((sum, value) => sum + value, 0);

    // Prepare response
    const data = {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueValues,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }
      ],
      totalRevenue
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting revenue stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting revenue stats',
      error: error.message
    });
  }
};

/**
 * Get recent activities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get recent user assets (purchases)
    const recentAssetPurchases = await UserAsset.findAll({
      attributes: ['id', 'user_id', 'asset_id', 'purchased_at'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'first_name', 'last_name']
        },
        {
          model: Asset,
          as: 'asset',
          attributes: ['id', 'name']
        }
      ],
      order: [['purchased_at', 'DESC']],
      limit: parseInt(limit),
      raw: true,
      nest: true
    });

    // Format activities
    const activities = recentAssetPurchases.map(purchase => ({
      id: purchase.id,
      type: 'asset_purchase',
      user: `${purchase.user.first_name} ${purchase.user.last_name}` || purchase.user.username,
      asset: purchase.asset.name,
      timestamp: purchase.purchased_at
    }));

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error getting recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recent activities',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getUserGrowth,
  getActivityDistribution,
  getAssetUsage,
  getTopAssets,
  getTopCategories,
  getRevenueStats,
  getRecentActivities
};
