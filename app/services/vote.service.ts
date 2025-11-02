import { apiClient } from '~/lib/api-client'
import type { VoteResponse } from '~/types'

export type VoteObjectType = 'threads' | 'posts'

export const voteService = {
  /**
   * Dar upvote em thread ou post
   * POST /api/:objType/:objectId/upvote
   */
  upvote: async (
    objType: VoteObjectType,
    objectId: string
  ): Promise<VoteResponse> => {
    const response = await apiClient.post<VoteResponse>(
      `/api/${objType}/${objectId}/upvote`
    )
    return response.data
  },

  /**
   * Dar downvote em thread ou post
   * POST /api/:objType/:objectId/downvote
   */
  downvote: async (
    objType: VoteObjectType,
    objectId: string
  ): Promise<VoteResponse> => {
    const response = await apiClient.post<VoteResponse>(
      `/api/${objType}/${objectId}/downvote`
    )
    return response.data
  },
}
