import { api } from './client'
import type { ListDto } from '../types'

export function createList(title: string) {
  return api.post<ListDto>('/lists', { title })
}

export function renameList(listId: number, title: string) {
  return api.patch<ListDto>(`/lists/${listId}`, { title })
}

export function deleteList(listId: number) {
  return api.delete<void>(`/lists/${listId}`)
}

export function reorderLists(orderedListIds: number[]) {
  return api.put<void>('/lists/reorder', { orderedListIds })
}
