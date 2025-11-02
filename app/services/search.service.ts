import { apiClient } from '~/lib/api-client'
import type { SearchThreadsResponse } from '~/types'

export interface SearchFilters {
  q: string // required
  semester?: number
  courses?: string[]
  subjects?: string[]
}

export const searchService = {
  /**
   * Buscar threads por título
   * GET /api/search/threads
   */
  searchThreads: async (filters: SearchFilters): Promise<SearchThreadsResponse> => {
    const params = new URLSearchParams()

    params.append('q', filters.q)

    if (filters.semester) {
      params.append('semester', filters.semester.toString())
    }

    if (filters.courses) {
      filters.courses.forEach((course) => params.append('courses', course))
    }

    if (filters.subjects) {
      filters.subjects.forEach((subject) => params.append('subjects', subject))
    }

    const response = await apiClient.get<SearchThreadsResponse>(
      `/api/search/threads?${params.toString()}`
    )
    return response.data
  },
}
