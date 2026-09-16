import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
  useBoardQuery,
  useCreateCard,
  useCreateList,
  useDeleteCard,
  useDeleteList,
  useMoveCard,
  useRenameList,
  useReorderLists,
  useUpdateCard,
} from '../hooks/useBoard'
import type { Priority } from '../types'
import { ListColumn } from './ListColumn'
import { AddListForm } from './AddListForm'

export function Board() {
  const { data, isLoading, isError } = useBoardQuery()
  const createList = useCreateList()
  const renameList = useRenameList()
  const deleteList = useDeleteList()
  const reorderLists = useReorderLists()
  const createCard = useCreateCard()
  const updateCard = useUpdateCard()
  const deleteCard = useDeleteCard()
  const moveCard = useMoveCard()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  if (isLoading || !data) {
    return <div id="board" />
  }
  if (isError) {
    return <div id="board">読み込みに失敗しました</div>
  }

  const lists = [...data.lists].sort((a, b) => a.position - b.position)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || !data) return

    const activeType = active.data.current?.type
    if (activeType === 'list') {
      if (active.id === over.id) return
      const activeListId = active.data.current?.listId as number
      const currentOrder = lists.map((l) => l.id)
      const fromIndex = currentOrder.indexOf(activeListId)
      const overType = over.data.current?.type
      const toIndex =
        overType === 'list'
          ? currentOrder.indexOf(over.data.current?.listId as number)
          : currentOrder.length - 1
      if (fromIndex === -1 || toIndex === -1) return
      const newOrder = [...currentOrder]
      newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, activeListId)
      reorderLists.mutate(newOrder)
      return
    }

    if (activeType === 'card') {
      const cardId = active.data.current?.cardId as number
      const overType = over.data.current?.type
      let targetListId: number
      let targetPosition: number

      if (overType === 'card') {
        targetListId = over.data.current?.listId as number
        const overCardId = over.data.current?.cardId as number
        const targetList = lists.find((l) => l.id === targetListId)
        targetPosition = targetList ? targetList.cards.findIndex((c) => c.id === overCardId) : 0
      } else if (overType === 'list-cards') {
        targetListId = over.data.current?.listId as number
        const targetList = lists.find((l) => l.id === targetListId)
        targetPosition = targetList ? targetList.cards.length : 0
      } else {
        return
      }

      moveCard.mutate({ cardId, targetListId, targetPosition })
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div id="board">
        <SortableContext
          items={lists.map((l) => `list-${l.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              onRename={(title) => renameList.mutate({ listId: list.id, title })}
              onDelete={() => deleteList.mutate(list.id)}
              onAddCard={(text) => createCard.mutate({ listId: list.id, text })}
              onToggleCardDone={(cardId, done) => updateCard.mutate({ cardId, update: { done } })}
              onEditCardText={(cardId, text) => updateCard.mutate({ cardId, update: { text } })}
              onChangeCardPriority={(cardId, priority: Priority) =>
                updateCard.mutate({ cardId, update: { priority } })
              }
              onDeleteCard={(cardId) => deleteCard.mutate(cardId)}
            />
          ))}
        </SortableContext>
        <AddListForm onAdd={(title) => createList.mutate(title)} />
      </div>
    </DndContext>
  )
}
