export interface Post {
  id: string
  thread_id: string
  content: string
  author: string // username from backend
  upvotes?: number
  downvotes?: number
  score?: number
  user_vote?: 'upvote' | 'downvote' | null
  created_at: string
  updated_at?: string
}

export interface CreatePostDto {
  content: string
}

export interface UpdatePostDto {
  content?: string
  author?: string
}
