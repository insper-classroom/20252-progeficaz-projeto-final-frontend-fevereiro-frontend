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
  createThread: (title) => api.post('/threads', { title }),
  
  // Get a specific thread with posts
  getThread: (threadId) => api.get(`/threads/${threadId}`),
  
  // Create a post in a thread
  createPost: (threadId, author, content) => 
    api.post(`/threads/${threadId}/posts`, { author, content }),
};