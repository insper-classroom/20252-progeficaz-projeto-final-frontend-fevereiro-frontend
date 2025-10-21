import { useQuery } from '@tanstack/react-query'
import { filterService } from '~/services'

const FILTERS_KEY = 'filters'

export function useFiltersConfig() {
  return useQuery({
    queryKey: [FILTERS_KEY, 'config'],
    queryFn: () => filterService.getFiltersConfig(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useFiltersByType(filterType: string) {
  return useQuery({
    queryKey: [FILTERS_KEY, filterType],
    queryFn: () => filterService.getFiltersByType(filterType),
    enabled: !!filterType,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
