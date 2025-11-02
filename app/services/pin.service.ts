import { apiClient } from '~/lib/api-client'
import type { PinResponse } from '~/types'

export const pinService = {
  /**
   * Fixar post
   * POST /api/posts/:postId/pin
   */
  pinPost: async (postId: string): Promise<PinResponse> => {
    const response = await apiClient.post<PinResponse>(
      `/api/posts/${postId}/pin`
    )
    return response.data
  },

  /**
   * Desfixar post
   * DELETE /api/posts/:postId/pin
   */
  unpinPost: async (postId: string): Promise<PinResponse> => {
    const response = await apiClient.delete<PinResponse>(
      `/api/posts/${postId}/pin`
    )
    return response.data
  },
}
