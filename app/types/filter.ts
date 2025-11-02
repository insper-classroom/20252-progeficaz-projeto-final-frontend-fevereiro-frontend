// ==================== Filter Types ====================
export interface FilterOption {
  id: string | number
  name: string
}

export interface FilterConfig {
  semester: {
    required: boolean
    multiple: boolean
    depends_on: string[]
    options: FilterOption[]
  }
  course: {
    required: boolean
    multiple: boolean
    depends_on: string[]
    options: FilterOption[]
  }
  subject: {
    required: boolean
    multiple: boolean
    depends_on: string[]
    searchable: boolean
    options: Record<string, Record<number, string[]>>
  }
}
