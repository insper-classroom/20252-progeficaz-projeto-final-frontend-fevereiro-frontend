import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const forumAPI = {
  // Get all threads
  getThreads: () => api.get('/threads'),
  
  // Create a new thread
  createThread: (title, description = '') => {
    const payload = { title, description };
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