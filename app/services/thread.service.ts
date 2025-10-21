import { apiClient } from '~/lib/api-client'
import type { CreateThreadDto, Thread, UpdateThreadDto } from '~/types'

export const threadService = {
  listThreads: async (): Promise<Thread[]> => {
    const response = await apiClient.get<{threads: Thread[]}>('/api/threads')
    return response.data.threads
  },

  createThread: async (data: CreateThreadDto): Promise<Thread> => {
    const response = await apiClient.post<Thread>('/api/threads', data)
    return response.data
  },

  getThread: async (threadId: string): Promise<Thread> => {
    const response = await apiClient.get<Thread>(`/api/threads/${threadId}`)
    return response.data
  },

  updateThread: async (
    threadId: string,
    data: UpdateThreadDto
  ): Promise<Thread> => {
    const response = await apiClient.put<Thread>(
      `/api/threads/${threadId}`,
      data
    )
    return response.data
  },

  deleteThread: async (threadId: string): Promise<void> => {
    await apiClient.delete(`/api/threads/${threadId}`)
  },
}
