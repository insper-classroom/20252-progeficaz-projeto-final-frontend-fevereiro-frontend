import axios from 'axios';
import { 
  extractErrorMessage, 
  normalizeResponseData, 
  normalizeThread, 
  normalizePost,
   
} from '../utils/restfulHelpers.js';

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
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers
    });
    
    // Handle RESTful level 2 responses based on status codes
    switch (response.status) {
      case 200: // OK - GET/PUT requests
      case 201: // Created - POST requests
      case 202: // Accepted - Async operations
      case 204: // No Content - DELETE requests
        return response;
      default:
        console.warn('Unexpected success status:', response.status);
        return response;
    }
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers
    });
    
    // Use utility function for consistent error handling
    error.message = extractErrorMessage(error);
    
    return Promise.reject(error);
  }
);

export const forumAPI = {
  // Get all threads
  getThreads: async () => {
    console.log('Fetching all threads...');
    try {
      const response = await api.get('/threads');
      console.log('Threads received from API:', response.data);
      
      // Use utility function to normalize response structure
      const threads = normalizeResponseData(response.data, 'threads');
      console.log('After normalizeResponseData:', threads);
      
      // Normalize each thread to ensure required fields
      const normalizedThreads = threads.map(normalizeThread);
      
      console.log('Normalized threads:', normalizedThreads);
      
      // Return normalized response structure
      return {
        ...response,
        data: normalizedThreads
      };
    } catch (error) {
      console.error('Error in getThreads:', error);
      throw error;
    }
  },
  
  // Create a new thread with filters
  createThread: async (title, description = '', semester = null, courses = [], subjects = []) => {
    const payload = { 
      title: title.trim(), 
      description: description.trim(),
      semester,
      courses: Array.isArray(courses) ? courses : [],
      subjects: Array.isArray(subjects) ? subjects : []
    };
    
    console.log('API sending thread data:', payload);
    
    try {
      const response = await api.post('/threads', payload);
      console.log('Thread creation response:', response.data);
      
      // Use utility function to normalize response
      const createdThread = normalizeResponseData(response.data, 'post');
      const normalizedThread = normalizeThread(createdThread);
      
      // Return normalized response
      return {
        ...response,
        data: normalizedThread
      };
    } catch (error) {
      console.error('Error in createThread:', error);
      throw error;
    }
  },
  
  // Get a specific thread with posts
  getThread: async (threadId) => {
    console.log('Fetching thread with ID:', threadId);
    
    try {
      const response = await api.get(`/threads/${threadId}`);
      console.log('Thread detail response:', response.data);
      
      // Use utility function to normalize response structure
      const { thread, posts } = normalizeResponseData(response.data, 'thread');
      
      // Normalize thread and posts data
      const normalizedThread = normalizeThread(thread);
      const normalizedPosts = Array.isArray(posts) ? posts.map(normalizePost) : [];
      
      // Return normalized response structure
      return {
        ...response,
        data: {
          thread: normalizedThread,
          posts: normalizedPosts
        }
      };
    } catch (error) {
      console.error('Error in getThread:', error);
      throw error;
    }
  },
  
  // Create a post in a thread
  createPost: async (threadId, author, content) => {
    const payload = { 
      author: author.trim(), 
      content: content.trim() 
    };
    
    console.log('API sending post data:', payload);
    
    try {
      const response = await api.post(`/threads/${threadId}/posts`, payload);
      console.log('Post creation response:', response.data);
      
      // Use utility function to normalize response
      const createdPost = normalizeResponseData(response.data, 'post');
      const normalizedPost = normalizePost(createdPost);
      
      // Return normalized response
      return {
        ...response,
        data: normalizedPost
      };
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  },
};