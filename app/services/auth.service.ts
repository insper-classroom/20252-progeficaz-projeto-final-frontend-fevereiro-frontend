import { apiClient } from '~/lib/api-client'
import type { AuthResponse, LoginDto, RegisterDto } from '~/types'

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data)
    return response.data
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data)
    return response.data
  },
}
