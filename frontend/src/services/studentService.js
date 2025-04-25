import ApiService from './apiService';

class StudentService extends ApiService {
  constructor() {
    super('students');
  }
}

export default new StudentService();
