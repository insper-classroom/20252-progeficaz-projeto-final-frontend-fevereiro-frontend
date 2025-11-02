import type { Post } from './post'

// ==================== Thread Types ====================
export interface Thread {
  id: string
  author: string
  title: string // max 200 chars
  description?: string // max 500 chars
  semester: number // 1-10
  courses: string[] // Array of course IDs
  subjects: string[] // Array of subject names
  score: number // upvotes - downvotes
  created_at: string // ISO 8601
  user_vote: 'upvote' | 'downvote' | null
}

export interface ThreadWithPosts extends Thread {
  posts: Post[]
}

export interface CreateThreadRequest {
  title: string // Required, max 200 chars
  description?: string // Optional, max 500 chars
  semester: number // Required, 1-10
  courses?: string[] // Optional, course IDs
  subjects?: string[] // Optional, subject names
}

export interface UpdateThreadRequest {
  title?: string // max 200 chars
  description?: string // max 500 chars
  semester?: number // 1-10
  courses?: string[]
  subjects?: string[]
}

export interface ThreadsListResponse {
  threads: Thread[]
}
