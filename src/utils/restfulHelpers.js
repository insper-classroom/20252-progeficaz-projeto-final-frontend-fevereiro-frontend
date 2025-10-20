/**
 * Utility functions for handling RESTful level 2 responses
 */

/**
 * Standard HTTP status codes and their meanings
 */
export const HTTP_STATUS = {
  // Success responses
  OK: 200,                    // GET, PUT requests
  CREATED: 201,              // POST requests (resource created)
  ACCEPTED: 202,             // Async operations accepted
  NO_CONTENT: 204,           // DELETE requests (successfully deleted)
  
  // Client error responses
  BAD_REQUEST: 400,          // Invalid request data
  UNAUTHORIZED: 401,         // Authentication required
  FORBIDDEN: 403,            // Access denied
  NOT_FOUND: 404,            // Resource not found
  METHOD_NOT_ALLOWED: 405,   // HTTP method not allowed
  CONFLICT: 409,             // Resource already exists
  UNPROCESSABLE_ENTITY: 422, // Validation failed
  TOO_MANY_REQUESTS: 429,    // Rate limit exceeded
  
  // Server error responses
  INTERNAL_SERVER_ERROR: 500, // Server error
  BAD_GATEWAY: 502,          // Server is down
  SERVICE_UNAVAILABLE: 503,  // Temporary unavailable
  GATEWAY_TIMEOUT: 504       // Server timeout
};

/**
 * Extract error message from RESTful error response
 * @param {Error} error - Axios error object
 * @returns {string} - Human-readable error message
 */
export const extractErrorMessage = (error) => {
  if (!error.response) {
    // Network error
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  const { status, data } = error.response;
  
  // Try to get message from different possible fields
  const serverMessage = data?.message || data?.error || data?.detail;
  
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return serverMessage || 'Dados inválidos. Verifique os campos e tente novamente.';
    case HTTP_STATUS.UNAUTHORIZED:
      return serverMessage || 'Autenticação necessária. Faça login novamente.';
    case HTTP_STATUS.FORBIDDEN:
      return serverMessage || 'Acesso negado. Você não tem permissão para esta ação.';
    case HTTP_STATUS.NOT_FOUND:
      return serverMessage || 'Recurso não encontrado.';
    case HTTP_STATUS.METHOD_NOT_ALLOWED:
      return serverMessage || 'Método não permitido.';
    case HTTP_STATUS.CONFLICT:
      return serverMessage || 'Conflito. Este recurso já existe.';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return serverMessage || 'Dados de validação inválidos. Verifique todos os campos.';
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return serverMessage || 'Muitas tentativas. Aguarde um momento antes de tentar novamente.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return serverMessage || 'Erro interno do servidor. Tente novamente mais tarde.';
    case HTTP_STATUS.BAD_GATEWAY:
      return serverMessage || 'Servidor indisponível. Tente novamente mais tarde.';
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return serverMessage || 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      return serverMessage || 'Timeout do servidor. Tente novamente.';
    default:
      return serverMessage || `Erro HTTP ${status}. Tente novamente.`;
  }
};

/**
 * Normalize response data structure for consistent handling
 * @param {Object} responseData - Raw response data from API
 * @param {string} resourceType - Type of resource ('threads', 'thread', 'post', etc.)
 * @returns {Object} - Normalized data structure
 */
export const normalizeResponseData = (responseData, resourceType) => {
  if (!responseData) {
    return null;
  }
  
  switch (resourceType) {
    case 'threads':
      // Handle array of threads - check for new API structure first
      if (Array.isArray(responseData)) {
        return responseData;
      } else if (responseData.data && responseData.data.threads && Array.isArray(responseData.data.threads)) {
        // New API structure: { success: true, data: { threads: [...] } }
        return responseData.data.threads;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } else if (responseData.threads && Array.isArray(responseData.threads)) {
        return responseData.threads;
      }
      return [];
      
    case 'thread':
      // Handle single thread with possible posts
      if (responseData.thread && responseData.posts) {
        return { thread: responseData.thread, posts: responseData.posts };
      } else if (responseData.id || responseData._id) {
        return { 
          thread: responseData, 
          posts: responseData.posts || responseData.replies || [] 
        };
      } else if (responseData.data) {
        if (responseData.data.thread && responseData.data.posts) {
          return { thread: responseData.data.thread, posts: responseData.data.posts };
        } else {
          return { 
            thread: responseData.data, 
            posts: responseData.data.posts || responseData.data.replies || [] 
          };
        }
      }
      return { thread: responseData, posts: [] };
      
    case 'post':
      // Handle single post - check for new API structure first
      if (responseData.id || responseData._id) {
        return responseData;
      } else if (responseData.data && responseData.data.thread) {
        // New API structure for thread creation: { success: true, data: { thread: {...} } }
        return responseData.data.thread;
      } else if (responseData.data) {
        return responseData.data;
      } else if (responseData.post) {
        return responseData.post;
      }
      return responseData;
      
    default:
      return responseData;
  }
};

/**
 * Normalize thread data to ensure all required fields exist
 * @param {Object} thread - Raw thread data
 * @returns {Object} - Normalized thread with guaranteed fields
 */
export const normalizeThread = (thread) => {
  if (!thread) return null;
  
  return {
    ...thread,
    id: thread.id || thread._id,
    title: thread.title || '',
    description: thread.description || '',
    semester: thread.semester || null,
    courses: Array.isArray(thread.courses) ? thread.courses : [],
    subjects: Array.isArray(thread.subjects) ? thread.subjects : [],
    created_at: thread.created_at || thread.createdAt || new Date().toISOString(),
    posts_count: thread.posts_count || thread.postsCount || 0
  };
};

/**
 * Normalize post data to ensure all required fields exist
 * @param {Object} post - Raw post data
 * @returns {Object} - Normalized post with guaranteed fields
 */
export const normalizePost = (post) => {
  if (!post) return null;
  
  return {
    ...post,
    id: post.id || post._id,
    author: post.author || 'Anônimo',
    content: post.content || '',
    created_at: post.created_at || post.createdAt || new Date().toISOString()
  };
};

/**
 * Check if HTTP status code indicates success
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if success status
 */
export const isSuccessStatus = (status) => {
  return status >= 200 && status < 300;
};

/**
 * Check if HTTP status code indicates client error
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if client error status
 */
export const isClientError = (status) => {
  return status >= 400 && status < 500;
};

/**
 * Check if HTTP status code indicates server error
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if server error status
 */
export const isServerError = (status) => {
  return status >= 500 && status < 600;
};