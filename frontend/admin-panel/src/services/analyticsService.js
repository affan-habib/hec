import { api } from './apiService';

class AnalyticsService {
  async getDashboardStats() {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getUserGrowth(period = 'month') {
    try {
      const response = await api.get(`/analytics/users/growth?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth:', error);
      throw error;
    }
  }

  async getActivityDistribution() {
    try {
      const response = await api.get('/analytics/activity/distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity distribution:', error);
      throw error;
    }
  }

  async getAssetUsage() {
    try {
      const response = await api.get('/analytics/assets/usage');
      return response.data;
    } catch (error) {
      console.error('Error fetching asset usage:', error);
      throw error;
    }
  }

  async getTopAssets(limit = 5) {
    try {
      const response = await api.get(`/analytics/assets/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top assets:', error);
      throw error;
    }
  }

  async getTopCategories(limit = 5) {
    try {
      const response = await api.get(`/analytics/assets/categories/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top categories:', error);
      throw error;
    }
  }

  async getRevenueStats(period = 'month') {
    try {
      const response = await api.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  }

  async getUserEngagement(period = 'month') {
    try {
      const response = await api.get(`/analytics/users/engagement?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      throw error;
    }
  }

  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get(`/analytics/activities/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
