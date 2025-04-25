import ApiService from './apiService';

class AwardService extends ApiService {
  constructor() {
    super('awards');
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
  async awardUser(userId, awardId) {
    try {
      const response = await this.custom('post', '/award-user', { user_id: userId, award_id: awardId });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AwardService();
