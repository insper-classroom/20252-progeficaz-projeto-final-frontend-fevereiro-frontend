import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const forumAPI = {
  // Get all threads
  getThreads: () => api.get('/threads'),
  
  // Create a new thread with filters
  createThread: (title, description = '', semester = null, courses = [], subjects = []) => {
    const payload = { 
      title, 
      description,
      semester,
      courses,
      subjects
    };
    console.log('API sending thread data:', payload);
    return api.post('/threads', payload);
  },
  
  // Get a specific thread with posts
  getThread: (threadId) => {
    console.log('Fetching thread with ID:', threadId);
    return api.get(`/threads/${threadId}`);
  },
  
  // Create a post in a thread
  createPost: (threadId, author, content) => {
    const payload = { author, content };
    console.log('API sending post data:', payload);
    return api.post(`/threads/${threadId}/posts`, payload);
  },
};