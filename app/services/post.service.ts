import { apiClient } from '~/lib/api-client'
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  SuccessResponse,
} from '~/types'

export const postService = {
  /**
   * Criar post em uma thread
   * POST /api/threads/:threadId/posts
   */
  createPost: async (
    threadId: string,
    data: CreatePostRequest
  ): Promise<Post> => {
    const response = await apiClient.post<Post>(
      `/api/threads/${threadId}/posts`,
      data
    )
    return response.data
  },

  /**
   * Obter post por ID
   * GET /api/posts/:id
   */
  getPost: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/${postId}`)
    return response.data
  },

  /**
   * Atualizar post
   * PUT /api/posts/:id
   */
  updatePost: async (
    postId: string,
    data: UpdatePostRequest
  ): Promise<SuccessResponse> => {
    const response = await apiClient.put<SuccessResponse>(
      `/api/posts/${postId}`,
      data
    )
    return response.data
  },

  /**
   * Deletar post
   * DELETE /api/posts/:id
   */
  deletePost: async (postId: string): Promise<SuccessResponse> => {
    const response = await apiClient.delete<SuccessResponse>(
      `/api/posts/${postId}`
    )
    return response.data
  },
}
