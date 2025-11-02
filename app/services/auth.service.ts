import { apiClient } from '~/lib/api-client'
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  ResendVerificationRequest,
  User,
  SuccessResponse,
} from '~/types'

export const authService = {
  /**
   * Registrar novo usuário
   * POST /api/auth/register
   */
  register: async (data: RegisterRequest): Promise<SuccessResponse> => {
    const response = await apiClient.post<SuccessResponse>(
      '/api/auth/register',
      data
    )
    return response.data
  },

  /**
   * Verificar email com token
   * POST /api/auth/verify-email
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<SuccessResponse> => {
    const response = await apiClient.post<SuccessResponse>(
      '/api/auth/verify-email',
      data
    )
    return response.data
  },

  /**
   * Reenviar email de verificação
   * POST /api/auth/resend-verification
   */
  resendVerification: async (
    data: ResendVerificationRequest
  ): Promise<SuccessResponse> => {
    const response = await apiClient.post<SuccessResponse>(
      '/api/auth/resend-verification',
      data
    )
    return response.data
  },

  /**
   * Login
   * POST /api/auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/login',
      data
    )
    return response.data
  },

  /**
   * Obter usuário atual
   * GET /api/auth/me
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me')
    return response.data
  },
}
