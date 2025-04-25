import ApiService from './apiService';

class AssetCategoryService extends ApiService {
  constructor() {
    super('asset-categories');
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

export default new AssetCategoryService();
