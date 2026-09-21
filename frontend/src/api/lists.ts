import { apiGet } from './client'
import type { ListDto } from './types'

export function getLists(): Promise<ListDto[]> {
  return apiGet<ListDto[]>('/api/lists')
}
