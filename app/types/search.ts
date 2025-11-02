// ==================== Search Types ====================
export interface SearchThreadsResponse {
  query: string
  count: number
  results: SearchThreadResult[]
}

export interface SearchThreadResult {
  id: string
  title: string
  description?: string
  author: string
  semester: number
  courses: string[]
  subjects: string[]
  score: number
  created_at: string
  post_count: number
}
