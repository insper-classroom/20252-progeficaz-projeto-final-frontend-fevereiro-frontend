import { apiClient } from '~/lib/api-client'
import type { FiltersConfig, FilterType } from '~/types'

export const filterService = {
  getFiltersConfig: async (): Promise<FiltersConfig> => {
    const response = await apiClient.get<FiltersConfig>('/api/filters/config')
    return response.data
  },

  getFiltersByType: async (filterType: string): Promise<FilterType> => {
    const response = await apiClient.get<FilterType>(
      `/api/filters/${filterType}`
    )
    return response.data
  },
}
