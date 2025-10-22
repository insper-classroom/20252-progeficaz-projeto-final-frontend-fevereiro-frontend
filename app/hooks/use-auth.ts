import { useMutation } from '@tanstack/react-query'
import { authService } from '~/services'
import type { RegisterDto, LoginDto, AuthResponse } from '~/types'

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginDto): Promise<AuthResponse> => {
      // First, get the access token
      const loginResponse = await authService.login(data)

      // Store the token temporarily so the next request can use it
      localStorage.setItem('access_token', loginResponse.access_token)

      // Then fetch the user data
      const user = await authService.me()

      // Return the combined response
      return {
        access_token: loginResponse.access_token,
        user,
      }
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}
