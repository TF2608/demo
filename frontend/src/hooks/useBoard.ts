import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBoard } from '../api/board'
import { createList, deleteList, renameList, reorderLists } from '../api/lists'
import { createCard, deleteCard, moveCard, updateCard } from '../api/cards'
import type { BoardDto, Priority } from '../types'

const BOARD_KEY = ['board']

export function useBoardQuery() {
  return useQuery({ queryKey: BOARD_KEY, queryFn: fetchBoard })
}

function invalidateBoard(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: BOARD_KEY })
}

export function useCreateList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (title: string) => createList(title),
    onSuccess: () => invalidateBoard(queryClient),
  })
}

export function useRenameList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ listId, title }: { listId: number; title: string }) => renameList(listId, title),
    onSuccess: () => invalidateBoard(queryClient),
  })
}

export function useDeleteList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listId: number) => deleteList(listId),
    onSuccess: () => invalidateBoard(queryClient),
  })
}

export function useReorderLists() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderedListIds: number[]) => reorderLists(orderedListIds),
    onMutate: async (orderedListIds: number[]) => {
      await queryClient.cancelQueries({ queryKey: BOARD_KEY })
      const previous = queryClient.getQueryData<BoardDto>(BOARD_KEY)
      if (previous) {
        const byId = new Map(previous.lists.map((list) => [list.id, list]))
        const reordered = orderedListIds
          .map((id, index) => {
            const list = byId.get(id)
            return list ? { ...list, position: index } : undefined
          })
          .filter((list): list is NonNullable<typeof list> => list !== undefined)
        queryClient.setQueryData<BoardDto>(BOARD_KEY, { lists: reordered })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOARD_KEY, context.previous)
      }
    },
    onSettled: () => invalidateBoard(queryClient),
  })
}

export function useCreateCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ listId, text }: { listId: number; text: string }) => createCard(listId, text),
    onSuccess: () => invalidateBoard(queryClient),
  })
}

export function useUpdateCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      cardId,
      update,
    }: {
      cardId: number
      update: { text?: string; done?: boolean; priority?: Priority }
    }) => updateCard(cardId, update),
    onSuccess: () => invalidateBoard(queryClient),
  })
}

export function useDeleteCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) => deleteCard(cardId),
    onSuccess: () => invalidateBoard(queryClient),
  })
}

export function useMoveCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      cardId,
      targetListId,
      targetPosition,
    }: {
      cardId: number
      targetListId: number
      targetPosition: number
    }) => moveCard(cardId, targetListId, targetPosition),
    onMutate: async ({ cardId, targetListId, targetPosition }) => {
      await queryClient.cancelQueries({ queryKey: BOARD_KEY })
      const previous = queryClient.getQueryData<BoardDto>(BOARD_KEY)
      if (previous) {
        let movedCard
        const listsWithoutCard = previous.lists.map((list) => {
          const found = list.cards.find((card) => card.id === cardId)
          if (found) movedCard = found
          return { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
        })
        if (movedCard) {
          const next = listsWithoutCard.map((list) => {
            if (list.id !== targetListId) return list
            const cards = [...list.cards]
            const clampedIndex = Math.max(0, Math.min(targetPosition, cards.length))
            cards.splice(clampedIndex, 0, { ...movedCard!, listId: targetListId })
            return { ...list, cards: cards.map((card, index) => ({ ...card, position: index })) }
          })
          queryClient.setQueryData<BoardDto>(BOARD_KEY, { lists: next })
        }
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOARD_KEY, context.previous)
      }
    },
    onSettled: () => invalidateBoard(queryClient),
  })
}
