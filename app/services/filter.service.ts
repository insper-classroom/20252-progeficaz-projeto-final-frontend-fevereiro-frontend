import { apiClient } from '~/lib/api-client'
import type { FilterConfig, FilterOption } from '~/types'

export type FilterType = 'semesters' | 'courses' | 'subjects'

export interface SubjectsFilters {
  courses?: string[]
  semester?: number
  q?: string // search query
}

export const filterService = {
  /**
   * Obter configuração completa de filtros
   * GET /api/filters/config
   */
  getFiltersConfig: async (): Promise<FilterConfig> => {
    const response = await apiClient.get<FilterConfig>('/api/filters/config')
    return response.data
  },

  /**
   * Obter opções de filtro por tipo
   * GET /api/filters/:filterType
   */
  getFiltersByType: async (
    filterType: FilterType,
    filters?: SubjectsFilters
  ): Promise<FilterOption[] | string[]> => {
    const params = new URLSearchParams()

    if (filterType === 'subjects' && filters) {
      if (filters.courses) {
        filters.courses.forEach((course) => params.append('courses', course))
      }
      if (filters.semester) {
        params.append('semester', filters.semester.toString())
      }
      if (filters.q) {
        params.append('q', filters.q)
      }
    }

    const response = await apiClient.get<FilterOption[] | string[]>(
      `/api/filters/${filterType}${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },
}
