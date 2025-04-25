import ApiService from './apiService';

class TutorService extends ApiService {
  constructor() {
    super('tutors');
  }
}

export default new TutorService();
