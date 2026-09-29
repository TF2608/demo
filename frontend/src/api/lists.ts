import { apiGet, apiPatch } from './client'
import type { ListDto } from './types'

export function getLists(): Promise<ListDto[]> {
  return apiGet<ListDto[]>('/api/lists')
}

export interface UpdateListPayload {
  title?: string
}

export function updateList(id: number, payload: UpdateListPayload): Promise<ListDto> {
  return apiPatch<ListDto>(`/api/lists/${id}`, payload)
}
