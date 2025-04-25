import ApiService from './apiService';

class DiaryService extends ApiService {
  constructor() {
    super('diaries');
  }

  // Get diary pages
  async getDiaryPages(diaryId, params = {}) {
    try {
      const response = await this.custom('get', `/${diaryId}/pages`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create diary page
  async createDiaryPage(diaryId, data) {
    try {
      const response = await this.custom('post', `/${diaryId}/pages`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update diary page
  async updateDiaryPage(diaryId, pageId, data) {
    try {
      const response = await this.custom('put', `/${diaryId}/pages/${pageId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete diary page
  async deleteDiaryPage(diaryId, pageId) {
    try {
      const response = await this.custom('delete', `/${diaryId}/pages/${pageId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new DiaryService();
