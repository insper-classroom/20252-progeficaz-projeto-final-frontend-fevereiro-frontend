import { useMutation } from '@tanstack/react-query'
import { authService } from '~/services'
import type { RegisterDto, LoginDto } from '~/types'

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}
