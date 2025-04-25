import ApiService from './apiService';

class SkinService extends ApiService {
  constructor() {
    super('skins');
  }
}

export default new SkinService();
