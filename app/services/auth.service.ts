import { apiClient } from '~/lib/api-client'
import type { LoginDto, LoginResponse, RegisterDto, User } from '~/types'

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
}
