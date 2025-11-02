import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pinService } from '~/services'

/**
 * Hook para fixar post
 */
export function usePinPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => pinService.pinPost(postId),
    onSuccess: () => {
      // Invalidar threads para recarregar ordem dos posts
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

/**
 * Hook para desfixar post
 */
export function useUnpinPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => pinService.unpinPost(postId),
    onSuccess: () => {
      // Invalidar threads para recarregar ordem dos posts
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}
