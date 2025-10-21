import { apiClient } from '~/lib/api-client'
import type { Post, CreatePostDto, UpdatePostDto } from '~/types'

export const postService = {
  getPost: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/${postId}`)
    return response.data
  },

  createPost: async (threadId: string, data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<Post>(
      `/api/threads/${threadId}/posts`,
      data
    )
    return response.data
  },

  updatePost: async (postId: string, data: UpdatePostDto): Promise<Post> => {
    const response = await apiClient.put<Post>(`/api/posts/${postId}`, data)
    return response.data
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${postId}`)
  },
}
