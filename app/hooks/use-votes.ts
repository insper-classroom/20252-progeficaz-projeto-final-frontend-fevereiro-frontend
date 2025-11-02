import { useMutation, useQueryClient } from '@tanstack/react-query'
import { voteService, type VoteObjectType } from '~/services'

/**
 * Hook para dar upvote
 */
export function useUpvote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objType,
      objectId,
    }: {
      objType: VoteObjectType
      objectId: string
    }) => voteService.upvote(objType, objectId),
    onSuccess: (_, variables) => {
      // Invalidar cache baseado no tipo do objeto
      if (variables.objType === 'threads') {
        queryClient.invalidateQueries({ queryKey: ['threads'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['threads'] })
        queryClient.invalidateQueries({ queryKey: ['posts', variables.objectId] })
      }
    },
  })
}

/**
 * Hook para dar downvote
 */
export function useDownvote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objType,
      objectId,
    }: {
      objType: VoteObjectType
      objectId: string
    }) => voteService.downvote(objType, objectId),
    onSuccess: (_, variables) => {
      // Invalidar cache baseado no tipo do objeto
      if (variables.objType === 'threads') {
        queryClient.invalidateQueries({ queryKey: ['threads'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['threads'] })
        queryClient.invalidateQueries({ queryKey: ['posts', variables.objectId] })
      }
    },
  })
}
