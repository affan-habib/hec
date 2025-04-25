import ApiService from './apiService';
import { api } from './apiService';

class DiaryPageService extends ApiService {
  constructor() {
    super('diary-pages');
  }

  // Get diary page details
  async getPageDetails(pageId) {
    try {
      // Use the correct API endpoint for diary page details
      const response = await api.get(`/diary-pages/${pageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update diary page content
  async updatePageContent(pageId, content) {
    try {
      // Update diary page content with the correct API endpoint
      const response = await api.put(`/diary-pages/${pageId}`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Add image to diary page
  async addImage(pageId, imageData) {
    try {
      // Add image to diary page with the correct API endpoint
      const formData = new FormData();
      formData.append('image', imageData.file);

      const response = await api.post(`/diary-pages/${pageId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Remove image from diary page
  async removeImage(pageId, imageId) {
    try {
      // Remove image from diary page with the correct API endpoint
      const response = await api.delete(`/diary-pages/${pageId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DiaryPageService();
