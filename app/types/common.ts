// ==================== Common Response Types ====================
export interface ErrorResponse {
  error: string
  details?: any
}

export interface SuccessResponse<T = any> {
  message?: string
  [key: string]: T
}
