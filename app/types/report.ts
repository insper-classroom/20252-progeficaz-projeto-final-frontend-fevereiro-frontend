// ==================== Report Types ====================
export type ReportType =
  | 'sexual' // Conteúdo sexual explícito
  | 'violence' // Violência ou ameaças
  | 'discrimination' // Discriminação/discurso de ódio
  | 'scam' // Golpe/fraude
  | 'self_harm' // Auto-mutilação/suicídio
  | 'spam' // Spam
  | 'other' // Outros (requer descrição)

export type ReportStatus =
  | 'pending' // Aguardando análise
  | 'reviewed' // Em análise
  | 'resolved' // Resolvido
  | 'dismissed' // Descartado

export interface Report {
  id: string
  reporter: string
  content_type: 'thread' | 'post'
  content_id: string
  report_type: ReportType
  description?: string
  status: ReportStatus
  created_at: string // ISO 8601
}

export interface CreateReportRequest {
  content_type: 'thread' | 'post'
  content_id: string
  report_type: ReportType
  description?: string // Required if report_type === 'other'
}

export interface ReportTypeOption {
  id: ReportType
  name: string
  description: string
}

export interface ReportsListResponse {
  reports: Report[]
}
