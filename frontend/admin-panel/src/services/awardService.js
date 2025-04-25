import ApiService from './apiService';

class AwardService extends ApiService {
  constructor() {
    super('awards');
  }

  // Override getAll to filter out empty query parameters
  async getAll(params = {}) {
    // Filter out empty string values from params
    const filteredParams = {};

    for (const key in params) {
      if (params[key] !== '') {
        filteredParams[key] = params[key];
      }
    }

    return super.getAll(filteredParams);
  }

  // Override create to handle points_required vs points field
  async create(data) {
    // Convert points_required to points if needed
    if (data.points_required !== undefined && data.points === undefined) {
      data.points = data.points_required;
      delete data.points_required;
    }

    return super.create(data);
  }

  // Override update to handle points_required vs points field
  async update(id, data) {
    // Convert points_required to points if needed
    if (data.points_required !== undefined && data.points === undefined) {
      data.points = data.points_required;
      delete data.points_required;
    }

    return super.update(id, data);
  }

  // Get user awards
  async getUserAwards(userId, params = {}) {
    try {
      const response = await this.custom('get', `/user/${userId}`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Award a user
  async assignAward(userId, awardId) {
    try {
      const response = await this.custom('post', '/assign', { user_id: userId, award_id: awardId });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AwardService();
