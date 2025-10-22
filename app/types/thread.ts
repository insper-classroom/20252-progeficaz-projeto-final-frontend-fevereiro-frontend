import type { Post } from './post'

export interface Thread {
  id: string
  author: string
  title: string
  description?: string
  semester?: number
  courses?: string[]
  subjects?: string[]
  posts?: Post[]
  upvotes?: number
  downvotes?: number
  score?: number
  user_vote?: 'upvote' | 'downvote' | null
  created_at: string
  updated_at?: string
}

export interface CreateThreadDto {
  title: string
  description?: string
  semester?: number
  courses?: string[]
  subjects?: string[]
}

export interface UpdateThreadDto {
  title?: string
  description?: string
  semester?: number
  courses?: string[]
  subjects?: string[]
}
