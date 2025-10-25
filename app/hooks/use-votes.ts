import { useMutation, useQueryClient } from '@tanstack/react-query'
import { voteService } from '~/services/vote.service'

const POSTS_KEY = 'posts'
const THREADS_KEY = 'threads'

type Vars = { postId: string; objType: "posts" | "threads" }

// Post voting hooks
export function useUpvoteObj() {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, Vars>({
    mutationFn: ({ postId, objType }) => voteService.upvoteObj(postId, objType),
    onSuccess: (_, { postId, objType }) => {
      const key = objType === "posts" ? POSTS_KEY : THREADS_KEY
      // invalidate list and specific item so UI refetches
      queryClient.invalidateQueries([key]) // refresh list
      queryClient.invalidateQueries([key, postId]) // refresh single item if present
    },
  })
}

export function useDownvoteObj() {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, Vars>({
    mutationFn: ({ postId, objType }) => voteService.downvoteObj(postId, objType),
    onSuccess: (_, { postId, objType }) => {
      const key = objType === "posts" ? POSTS_KEY : THREADS_KEY
      queryClient.invalidateQueries([key])
      queryClient.invalidateQueries([key, postId])
    },
  })
}