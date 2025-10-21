export interface FilterOption {
  id: string
  label: string
  value: string
}

export interface FilterType {
  type: string
  label: string
  options: FilterOption[]
}

export interface FiltersConfig {
  filters: FilterType[]
}
