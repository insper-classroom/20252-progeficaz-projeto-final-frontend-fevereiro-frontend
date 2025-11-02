import { useQuery } from '@tanstack/react-query'
import { searchService, type SearchFilters } from '~/services'

/**
 * Hook para buscar threads
 */
export function useSearchThreads(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: ['search', 'threads', filters],
    queryFn: () => searchService.searchThreads(filters),
    enabled: enabled && !!filters.q, // Só executar se houver query
  })
}
