import { useMutation, useQueryClient } from '@tanstack/react-query'
import { voteService } from '~/services/vote.service'

const POSTS_KEY = 'posts'
const THREADS_KEY = 'threads'

// Post voting hooks
export function useUpvotePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => voteService.upvotePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_KEY, postId] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}

export function useDownvotePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => voteService.downvotePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_KEY, postId] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}

export function useRemovePostVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => voteService.removePostVote(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_KEY, postId] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}

// Thread voting hooks
export function useUpvoteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (threadId: string) => voteService.upvoteThread(threadId),
    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY, threadId] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}

export function useDownvoteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (threadId: string) => voteService.downvoteThread(threadId),
    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY, threadId] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}

export function useRemoveThreadVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (threadId: string) => voteService.removeThreadVote(threadId),
    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY, threadId] })
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}
