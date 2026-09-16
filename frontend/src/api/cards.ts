import { api } from './client'
import type { CardDto, Priority } from '../types'

export function createCard(listId: number, text: string) {
  return api.post<CardDto>(`/lists/${listId}/cards`, { text })
}

export function updateCard(
  cardId: number,
  update: { text?: string; done?: boolean; priority?: Priority },
) {
  return api.patch<CardDto>(`/cards/${cardId}`, update)
}

export function deleteCard(cardId: number) {
  return api.delete<void>(`/cards/${cardId}`)
}

export function moveCard(cardId: number, targetListId: number, targetPosition: number) {
  return api.put<CardDto>(`/cards/${cardId}/move`, { targetListId, targetPosition })
}
