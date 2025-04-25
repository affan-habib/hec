import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // Get all items with optional pagination and filters
  async getAll(params = {}) {
    try {
      const response = await api.get(`/${this.endpoint}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get a single item by ID
  async getById(id) {
    try {
      const response = await api.get(`/${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new item
  async create(data) {
    try {
      const response = await api.post(`/${this.endpoint}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing item
  async update(id, data) {
    try {
      const response = await api.put(`/${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete an item
  async delete(id) {
    try {
      const response = await api.delete(`/${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Custom API call
  async custom(method, url, data = null, config = {}) {
    try {
      const response = await api({
        method,
        url: `/${this.endpoint}${url}`,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export { api };
export default ApiService;
