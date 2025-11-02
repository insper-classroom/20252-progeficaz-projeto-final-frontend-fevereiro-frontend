import { useQuery } from '@tanstack/react-query'
import { healthService } from '~/services'

/**
 * Hook para health check simples
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthService.healthCheck(),
    refetchInterval: 1000 * 60 * 5, // Revalidar a cada 5 minutos
  })
}

/**
 * Hook para health check detalhado
 */
export function useDetailedHealthCheck() {
  return useQuery({
    queryKey: ['health', 'detailed'],
    queryFn: () => healthService.detailedHealthCheck(),
    refetchInterval: 1000 * 60 * 5, // Revalidar a cada 5 minutos
  })
}
