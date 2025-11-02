import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { threadService, type ThreadFilters } from '~/services'
import type { CreateThreadRequest, UpdateThreadRequest } from '~/types'

/**
 * Hook para listar threads
 */
export function useThreads(filters?: ThreadFilters) {
  return useQuery({
    queryKey: ['threads', filters],
    queryFn: () => threadService.listThreads(filters),
  })
}

/**
 * Hook para obter uma thread específica
 */
export function useThread(threadId: string) {
  return useQuery({
    queryKey: ['threads', threadId],
    queryFn: () => threadService.getThread(threadId),
    enabled: !!threadId,
  })
}

/**
 * Hook para criar thread
 */
export function useCreateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateThreadRequest) => threadService.createThread(data),
    onSuccess: () => {
      // Invalidar lista de threads
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

/**
 * Hook para atualizar thread
 */
export function useUpdateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      threadId,
      data,
    }: {
      threadId: string
      data: UpdateThreadRequest
    }) => threadService.updateThread(threadId, data),
    onSuccess: (_, variables) => {
      // Invalidar thread específica e lista
      queryClient.invalidateQueries({ queryKey: ['threads', variables.threadId] })
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

/**
 * Hook para deletar thread
 */
export function useDeleteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (threadId: string) => threadService.deleteThread(threadId),
    onSuccess: () => {
      // Invalidar lista de threads
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}
