export interface Thread {
  id: string
  title: string
  description?: string
  filters?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateThreadDto {
  title: string
  description?: string
  filters?: Record<string, any>
}

export interface UpdateThreadDto {
  title?: string
  description?: string
  filters?: Record<string, any>
}
