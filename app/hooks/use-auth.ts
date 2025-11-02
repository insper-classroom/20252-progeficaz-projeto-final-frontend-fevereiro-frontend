import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '~/services'
import type {
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from '~/types'

/**
 * Hook para obter usuário atual
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  })
}

/**
 * Hook para registrar usuário
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  })
}

/**
 * Hook para login
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Salvar token no localStorage
      localStorage.setItem('access_token', response.access_token)
      // Invalidar cache do usuário atual
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}

/**
 * Hook para logout
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    queryClient.clear()
    window.location.href = '/login'
  }
}

/**
 * Hook para verificar email
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
  })
}

/**
 * Hook para reenviar email de verificação
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) =>
      authService.resendVerification(data),
  })
}
