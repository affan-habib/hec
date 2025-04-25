import ApiService from './apiService';

class ForumService extends ApiService {
  constructor() {
    super('forums');
  }

  // Get forum topics
  async getForumTopics(forumId, params = {}) {
    try {
      const response = await this.custom('get', `/${forumId}/topics`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get topic posts
  async getTopicPosts(topicId, params = {}) {
    try {
      const response = await this.custom('get', `/topics/${topicId}/posts`, null, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create topic
  async createTopic(forumId, data) {
    try {
      const response = await this.custom('post', `/${forumId}/topics`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create post
  async createPost(topicId, content) {
    try {
      const response = await this.custom('post', `/topics/${topicId}/posts`, { content });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update post
  async updatePost(postId, content) {
    try {
      const response = await this.custom('put', `/posts/${postId}`, { content });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete post
  async deletePost(postId) {
    try {
      const response = await this.custom('delete', `/posts/${postId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ForumService();
