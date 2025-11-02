import { useQuery } from '@tanstack/react-query'
import { filterService, type FilterType, type SubjectsFilters } from '~/services'

/**
 * Hook para obter configuração completa de filtros
 */
export function useFiltersConfig() {
  return useQuery({
    queryKey: ['filters', 'config'],
    queryFn: () => filterService.getFiltersConfig(),
    staleTime: 1000 * 60 * 60, // 1 hora - filtros não mudam com frequência
  })
}

/**
 * Hook para obter opções de filtro por tipo
 */
export function useFiltersByType(
  filterType: FilterType,
  filters?: SubjectsFilters
) {
  return useQuery({
    queryKey: ['filters', filterType, filters],
    queryFn: () => filterService.getFiltersByType(filterType, filters),
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

/**
 * Hook helper para obter semestres
 */
export function useSemesters() {
  return useFiltersByType('semesters')
}

/**
 * Hook helper para obter cursos
 */
export function useCourses() {
  return useFiltersByType('courses')
}

/**
 * Hook helper para obter matérias
 */
export function useSubjects(filters?: SubjectsFilters) {
  return useFiltersByType('subjects', filters)
}
