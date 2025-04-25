import ApiService, { api } from './apiService';

class ImageService extends ApiService {
  constructor() {
    super('images');
  }

  // Upload image
  async uploadImage(formData) {
    try {
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user images
  async getUserImages(params = {}) {
    try {
      const response = await this.custom('get', '/user', null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ImageService();
