// ==================== Post Types ====================
export interface Post {
  id: string
  thread_id: string
  author: string
  content: string
  pinned: boolean
  score: number // upvotes - downvotes
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
  user_vote: 'upvote' | 'downvote' | null
}

export interface CreatePostRequest {
  content: string // Required
}

export interface UpdatePostRequest {
  content: string // Required
}
