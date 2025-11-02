// ==================== User Types ====================
export interface User {
  id: string
  username: string
  email: string
}

export interface RegisterRequest {
  email: string // Must be @insper.edu.br or @al.insper.edu.br
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  access_token: string
}

export interface VerifyEmailRequest {
  authToken: string // Token received via email
}

export interface ResendVerificationRequest {
  email: string
}
