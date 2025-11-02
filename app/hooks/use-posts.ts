import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postService } from '~/services'
import type { CreatePostRequest, UpdatePostRequest } from '~/types'

/**
 * Hook para obter um post específico
 */
export function usePost(postId: string) {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  })
}

/**
 * Hook para criar post
 */
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      threadId,
      data,
    }: {
      threadId: string
      data: CreatePostRequest
    }) => postService.createPost(threadId, data),
    onSuccess: (_, variables) => {
      // Invalidar thread específica para recarregar posts
      queryClient.invalidateQueries({ queryKey: ['threads', variables.threadId] })
    },
  })
}

/**
 * Hook para atualizar post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string
      data: UpdatePostRequest
    }) => postService.updatePost(postId, data),
    onSuccess: (_, variables) => {
      // Invalidar post específico
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] })
      // Invalidar threads para recarregar posts
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

/**
 * Hook para deletar post
 */
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: () => {
      // Invalidar threads para recarregar posts
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}
