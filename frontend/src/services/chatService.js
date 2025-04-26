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

  // Get chat by ID
  async getById(id) {
    try {
      console.log(`Fetching chat with ID: ${id}`);
      const response = await this.custom('get', `/${id}`);
      console.log('Chat response:', response);
      return response;
    } catch (error) {
      console.error(`Error fetching chat with ID ${id}:`, error);
      throw error;
    }
  }

  // Find or create a direct chat with a user (for admin use)
  async findOrCreateDirectChat(userId) {
    try {
      console.log(`Finding or creating direct chat with user ID: ${userId}`);
      const response = await this.custom('get', `/direct/${userId}`);
      console.log('Direct chat response:', response);
      return response;
    } catch (error) {
      console.error(`Error finding/creating direct chat with user ID ${userId}:`, error);
      throw error;
    }
  }
}

export default new ChatService();
