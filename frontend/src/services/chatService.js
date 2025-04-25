import ApiService from './apiService';

class ChatService extends ApiService {
  constructor() {
    super('chats');
  }

  // Get chat messages
  async getChatMessages(chatId, params = {}) {
    try {
      const response = await this.custom('get', `/${chatId}/messages`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Send message
  async sendMessage(chatId, content) {
    try {
      const response = await this.custom('post', `/${chatId}/messages`, { content });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add participant
  async addParticipant(chatId, userId) {
    try {
      const response = await this.custom('post', `/${chatId}/participants`, { user_id: userId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove participant
  async removeParticipant(chatId, userId) {
    try {
      const response = await this.custom('delete', `/${chatId}/participants/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Leave chat
  async leaveChat(chatId) {
    try {
      const response = await this.custom('post', `/${chatId}/leave`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatService();
