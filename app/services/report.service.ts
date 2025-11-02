import { apiClient } from '~/lib/api-client'
import type {
  Report,
  CreateReportRequest,
  ReportsListResponse,
  SuccessResponse,
} from '~/types'

export const reportService = {
  /**
   * Criar denúncia
   * POST /api/reports
   */
  createReport: async (data: CreateReportRequest): Promise<Report> => {
    const response = await apiClient.post<Report>('/api/reports', data)
    return response.data
  },

  /**
   * Listar todas denúncias
   * GET /api/reports
   */
  listReports: async (): Promise<Report[]> => {
    const response =
      await apiClient.get<ReportsListResponse>('/api/reports')
    return response.data.reports
  },

  /**
   * Obter denúncia por ID
   * GET /api/reports/:id
   */
  getReport: async (reportId: string): Promise<Report> => {
    const response = await apiClient.get<Report>(`/api/reports/${reportId}`)
    return response.data
  },
}
