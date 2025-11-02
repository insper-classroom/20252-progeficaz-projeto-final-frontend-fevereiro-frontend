import { apiClient } from '~/lib/api-client'
import type {
  Thread,
  ThreadWithPosts,
  CreateThreadRequest,
  UpdateThreadRequest,
  ThreadsListResponse,
  SuccessResponse,
} from '~/types'

export interface ThreadFilters {
  semester?: number
  courses?: string[]
  subjects?: string[]
}

export const threadService = {
  /**
   * Listar threads com filtros opcionais
   * GET /api/threads
   */
  listThreads: async (filters?: ThreadFilters): Promise<Thread[]> => {
    const params = new URLSearchParams()

    if (filters?.semester) {
      params.append('semester', filters.semester.toString())
    }

    if (filters?.courses) {
      filters.courses.forEach((course) => params.append('courses', course))
    }

    if (filters?.subjects) {
      filters.subjects.forEach((subject) => params.append('subjects', subject))
    }

    const response = await apiClient.get<ThreadsListResponse>(
      `/api/threads${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data.threads
  },

  /**
   * Criar nova thread
   * POST /api/threads
   */
  createThread: async (data: CreateThreadRequest): Promise<Thread> => {
    const response = await apiClient.post<Thread>('/api/threads', data)
    return response.data
  },

  /**
   * Obter thread com posts
   * GET /api/threads/:id
   */
  getThread: async (threadId: string): Promise<ThreadWithPosts> => {
    const response = await apiClient.get<ThreadWithPosts>(
      `/api/threads/${threadId}`
    )
    return response.data
  },

  /**
   * Atualizar thread
   * PUT /api/threads/:id
   */
  updateThread: async (
    threadId: string,
    data: UpdateThreadRequest
  ): Promise<SuccessResponse> => {
    const response = await apiClient.put<SuccessResponse>(
      `/api/threads/${threadId}`,
      data
    )
    return response.data
  },

  /**
   * Deletar thread
   * DELETE /api/threads/:id
   */
  deleteThread: async (threadId: string): Promise<SuccessResponse> => {
    const response = await apiClient.delete<SuccessResponse>(
      `/api/threads/${threadId}`
    )
    return response.data
  },
}
