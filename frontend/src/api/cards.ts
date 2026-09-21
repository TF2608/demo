import { apiGet } from './client'
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
