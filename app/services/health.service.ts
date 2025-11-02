import { apiClient } from '~/lib/api-client'
import type { HealthCheckResponse, DetailedHealthCheckResponse } from '~/types'

export const healthService = {
  /**
   * Health check simples
   * GET /health
   */
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await apiClient.get<HealthCheckResponse>('/health')
    return response.data
  },

  /**
   * Health check detalhado
   * GET /health/detailed
   */
  detailedHealthCheck: async (): Promise<DetailedHealthCheckResponse> => {
    const response = await apiClient.get<DetailedHealthCheckResponse>(
      '/health/detailed'
    )
    return response.data
  },
}
