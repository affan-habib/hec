import ApiService from './apiService';

class TutorService extends ApiService {
  constructor() {
    super('tutors');
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
}

export default new TutorService();
