import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postService } from '~/services'
import type { CreatePostDto, UpdatePostDto } from '~/types'

const POSTS_KEY = 'posts'
const THREADS_KEY = 'threads'

export function usePost(postId: string) {
  return useQuery({
    queryKey: [POSTS_KEY, postId],
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      threadId,
      data,
    }: {
      threadId: string
      data: CreatePostDto
    }) => postService.createPost(threadId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [THREADS_KEY, variables.threadId],
      })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: UpdatePostDto }) =>
      postService.updatePost(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_KEY, variables.postId] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_KEY] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}
