import ApiService from './apiService';

class AssetService extends ApiService {
  constructor() {
    super('assets');
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

  // Get assets by category
  async getByCategory(categoryId, params = {}) {
    try {
      const response = await this.custom('get', `/category/${categoryId}`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Assign asset to user
  async assignToUser(userId, assetId, data = {}) {
    try {
      const payload = {
        user_id: userId,
        asset_id: assetId,
        ...data
      };
      const response = await this.custom('post', '/assign', payload);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove asset from user
  async removeFromUser(userId, assetId) {
    try {
      const response = await this.custom('delete', `/user/${userId}/asset/${assetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user assets
  async getUserAssets(userId, params = {}) {
    try {
      const response = await this.custom('get', `/user/${userId}`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload asset image
  async uploadImage(file, onProgress) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await this.api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress ? 
          (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          } : undefined
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AssetService();
