import { apiClient } from '~/lib/api-client'

export const voteService = {
  // Post and Thread voting
  upvoteObj: async (postId: string, objType: "posts" | "threads"): Promise<void> => {
    await apiClient.post(`/api/${objType}/${postId}/upvote`)
  },

  downvoteObj: async (postId: string, objType: "posts" | "threads"): Promise<void> => {
    await apiClient.post(`/api/${objType}/${postId}/downvote`)
  },
}
