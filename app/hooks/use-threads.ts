import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { threadService } from '~/services'
import type { CreateThreadDto, UpdateThreadDto } from '~/types'

const THREADS_KEY = 'threads'

export function useThreads() {
  return useQuery({
    queryKey: [THREADS_KEY],
    queryFn: () => threadService.listThreads(),
  })
}

export function useThread(threadId: string) {
  return useQuery({
    queryKey: [THREADS_KEY, threadId],
    queryFn: () => threadService.getThread(threadId),
    enabled: !!threadId,
  })
}

export function useCreateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateThreadDto) => threadService.createThread(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}

export function useUpdateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      threadId,
      data,
    }: {
      threadId: string
      data: UpdateThreadDto
    }) => threadService.updateThread(threadId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
      queryClient.invalidateQueries({
        queryKey: [THREADS_KEY, variables.threadId],
      })
    },
  })
}

export function useDeleteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (threadId: string) => threadService.deleteThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [THREADS_KEY] })
    },
  })
}
