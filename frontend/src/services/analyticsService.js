import { api } from './apiService';

class AnalyticsService {
  async getDashboardStats() {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  }

  async getUserGrowth(period = 'month') {
    try {
      const response = await api.get(`/analytics/users/growth?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user growth data'
      };
    }
  }

  async getActivityDistribution() {
    try {
      const response = await api.get('/analytics/activity/distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity distribution:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch activity distribution data'
      };
    }
  }

  async getAssetUsage() {
    try {
      const response = await api.get('/analytics/assets/usage');
      return response.data;
    } catch (error) {
      console.error('Error fetching asset usage:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset usage data'
      };
    }
  }

  async getTopAssets(limit = 5) {
    try {
      const response = await api.get(`/analytics/assets/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top assets:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch top assets data'
      };
    }
  }

  async getTopCategories(limit = 5) {
    try {
      const response = await api.get(`/analytics/assets/categories/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch top categories data'
      };
    }
  }

  async getRevenueStats(period = 'month') {
    try {
      const response = await api.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch revenue statistics'
      };
    }
  }

  async getUserEngagement(period = 'month') {
    try {
      const response = await api.get(`/analytics/users/engagement?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user engagement data'
      };
    }
  }

  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get(`/analytics/activities/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent activities'
      };
    }
  }
}

export default new AnalyticsService();
