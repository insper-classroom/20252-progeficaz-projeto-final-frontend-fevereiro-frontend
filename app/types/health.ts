// ==================== Health Check Types ====================
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  database: 'connected' | 'disconnected'
  error?: string
}

export interface DetailedHealthCheckResponse {
  timestamp: string
  connection: {
    status: string
    type: string
    server_version: string
    performance: {
      response_time_ms: number
    }
  }
  database_operations: {
    status: string
    operations: {
      insert: string
      read: string
      update: string
      delete: string
    }
  }
}
