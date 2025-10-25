import type { Verify } from 'crypto'
import { apiClient } from '~/lib/api-client'
import type { LoginDto, LoginResponse, RegisterDto, VerifyEmailDto, ResendVerificationEmailDto, User} from '~/types'

export const authService = {
  register: async (data: RegisterDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/register', data)
    return response.data
  },

  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data)
    return response.data
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me')
    return response.data
  },
  verifyEmail: async (data: VerifyEmailDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/verify-email', data)
    return response.data
  },
  resendVerificationEmail: async (data: ResendVerificationEmailDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/resend-verification', data)
    return response.data
  },
}
