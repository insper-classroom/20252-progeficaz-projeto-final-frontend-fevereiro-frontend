export interface User {
  id: string
  username: string
  email: string
}

export interface RegisterDto {
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  message?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}
