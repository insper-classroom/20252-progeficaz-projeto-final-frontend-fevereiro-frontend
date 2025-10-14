import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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
  getThread: (threadId) => api.get(`/threads/${threadId}`),
  
  // Create a post in a thread
  createPost: (threadId, author, content) => {
    const payload = { author, content };
    console.log('API sending post data:', payload);
    return api.post(`/threads/${threadId}/posts`, payload);
  },
};