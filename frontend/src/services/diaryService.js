import ApiService from './apiService';
import { api } from './apiService';

class DiaryService extends ApiService {
  constructor() {
    super('diaries');
  }

  // Get diary pages
  async getDiaryPages(diaryId, params = {}) {
    try {
      // Use the correct API endpoint for diary pages
      const response = await api.get(`/diary-pages/diary/${diaryId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create diary page
  async createDiaryPage(diaryId, data) {
    try {
      // Create diary page with the correct API endpoint
      const payload = {
        ...data,
        diary_id: diaryId
      };
      const response = await api.post('/diary-pages', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update diary page
  async updateDiaryPage(diaryId, pageId, data) {
    try {
      // Update diary page with the correct API endpoint
      const response = await api.put(`/diary-pages/${pageId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete diary page
  async deleteDiaryPage(diaryId, pageId) {
    try {
      // Delete diary page with the correct API endpoint
      const response = await api.delete(`/diary-pages/${pageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Assign tutor to diary
  async assignTutor(diaryId, tutorId) {
    try {
      const response = await api.put(`/${diaryId}/assign-tutor`, { tutor_id: tutorId });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DiaryService();
