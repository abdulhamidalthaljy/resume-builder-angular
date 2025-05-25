import axios from 'axios';
import { Injectable } from '@angular/core';
import { PersonalDetails } from '../models/personal-details.model';
import { Language } from '../models/language.model';
import { WorkExperience } from '../models/work-experience.model';
import { Workshop } from '../models/workshop.model';
import { Education } from '../models/education.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private apiUrl = 'http://localhost:3000/api/resumes'; // Update this with your backend URL

  constructor() {}

  // Create a new resume
  async createResume(resumeData: any) {
    try {
      const response = await axios.post(this.apiUrl, resumeData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get all resumes
  async getResumes() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get a specific resume by ID
  async getResumeById(id: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update a resume
  async updateResume(id: string, resumeData: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, resumeData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete a resume
  async deleteResume(id: string) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handling
  private handleError(error: any) {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
}
