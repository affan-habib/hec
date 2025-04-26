import ApiService from './apiService';

class SkinService extends ApiService {
  constructor() {
    super('skins');
  }

  // Override getAll to properly format parameters
  async getAll(params = {}) {
    // Create a new params object with properly formatted values
    const formattedParams = { ...params };

    // Convert public_only to boolean if it's a string
    if (formattedParams.public_only !== undefined && formattedParams.public_only !== '') {
      formattedParams.public_only = formattedParams.public_only === 'true';
    } else {
      // Remove empty public_only parameter
      delete formattedParams.public_only;
    }

    // Convert user_id to integer if it's a string
    if (formattedParams.user_id !== undefined && formattedParams.user_id !== '') {
      formattedParams.user_id = parseInt(formattedParams.user_id);
    } else {
      // Remove empty user_id parameter
      delete formattedParams.user_id;
    }

    // Remove any other empty string parameters
    Object.keys(formattedParams).forEach(key => {
      if (formattedParams[key] === '') {
        delete formattedParams[key];
      }
    });

    // Call the parent getAll method with the formatted parameters
    return super.getAll(formattedParams);
  }
}

export default new SkinService();
