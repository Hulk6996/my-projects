import axios, { AxiosInstance } from 'axios';

export class AxiosApi {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
    });
  }

  async getUserData(userId: number): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user data: ${error.message}`);
    }
  }

  async postData(data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/endpoint', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to post data: ${error.message}`);
    }
  }
}