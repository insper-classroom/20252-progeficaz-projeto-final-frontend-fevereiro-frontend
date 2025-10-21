export interface Post {
  id: string
  thread_id: string
  content: string
  author: string
  created_at: string
  updated_at: string
}

export interface CreatePostDto {
  content: string
  author: string
}

export interface UpdatePostDto {
  content?: string
  author?: string
}
