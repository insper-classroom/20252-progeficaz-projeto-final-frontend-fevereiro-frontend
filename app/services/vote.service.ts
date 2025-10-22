import { apiClient } from '~/lib/api-client'

export const voteService = {
  // Post voting
  upvotePost: async (postId: string): Promise<void> => {
    await apiClient.post(`/api/posts/${postId}/upvote`)
  },

  downvotePost: async (postId: string): Promise<void> => {
    await apiClient.post(`/api/posts/${postId}/downvote`)
  },

  removePostVote: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${postId}/vote`)
  },

  // Thread voting
  upvoteThread: async (threadId: string): Promise<void> => {
    await apiClient.post(`/api/threads/${threadId}/upvote`)
  },

  downvoteThread: async (threadId: string): Promise<void> => {
    await apiClient.post(`/api/threads/${threadId}/downvote`)
  },

  removeThreadVote: async (threadId: string): Promise<void> => {
    await apiClient.delete(`/api/threads/${threadId}/vote`)
  },
}
