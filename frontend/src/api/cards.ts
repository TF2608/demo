import { apiGet, apiPatch } from './client'
import type { CardDto, Priority } from './types'

export interface SearchCardsParams {
  listId?: number
  priority?: Priority
  done?: boolean
  text?: string
}

export function searchCards(params: SearchCardsParams): Promise<CardDto[]> {
  return apiGet<CardDto[]>('/api/cards', {
    listId: params.listId?.toString(),
    priority: params.priority,
    done: params.done,
    text: params.text,
  })
}

export interface UpdateCardPayload {
  text?: string
  done?: boolean
  priority?: Priority
  listId?: number
  position?: number
  dueDate?: string | null
}

export function updateCard(id: number, payload: UpdateCardPayload): Promise<CardDto> {
  return apiPatch<CardDto>(`/api/cards/${id}`, payload)
}
