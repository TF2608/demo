import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { moveCard, searchCards, updateCard, type UpdateCardPayload } from './api/cards'
import { getLists, updateList, type UpdateListPayload } from './api/lists'
import type { CardDto, ListDto } from './api/types'
import { BoardColumn } from './components/BoardColumn'
import { SearchForm, type SearchFilters } from './components/SearchForm'
import './App.css'

const INITIAL_FILTERS: SearchFilters = {
  text: '',
  priority: '',
  done: 'all',
}

function App() {
  const [lists, setLists] = useState<ListDto[]>([])
  const [cards, setCards] = useState<CardDto[]>([])
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const snapshotRef = useRef<CardDto[] | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const dragDisabled = filters.text !== '' || filters.priority !== '' || filters.done !== 'all'

  useEffect(() => {
    getLists()
      .then(setLists)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'リストの取得に失敗しました'))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)

      searchCards({
        text: filters.text || undefined,
        priority: filters.priority || undefined,
        done: filters.done === 'all' ? undefined : filters.done === 'done',
      })
        .then(setCards)
        .catch((err: unknown) => setError(err instanceof Error ? err.message : '検索に失敗しました'))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  async function handleCardUpdate(id: number, payload: UpdateCardPayload) {
    const updated = await updateCard(id, payload)
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  async function handleListUpdate(id: number, payload: UpdateListPayload) {
    const updated = await updateList(id, payload)
    setLists((prev) => prev.map((l) => (l.id === id ? updated : l)))
  }

  // over が「リスト(空きエリア)」ならそのリストID、「カード」ならそのカードのリストIDを返す
  function resolveOverListId(overId: string | number, currentCards: CardDto[]): number | null {
    if (typeof overId === 'string' && overId.startsWith('list-')) {
      return Number(overId.slice('list-'.length))
    }
    return currentCards.find((c) => c.id === overId)?.listId ?? null
  }

  function handleDragStart(event: DragStartEvent) {
    snapshotRef.current = cards
    setActiveCardId(Number(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return
    const activeId = Number(active.id)

    setCards((prev) => {
      const activeCard = prev.find((c) => c.id === activeId)
      const overListId = resolveOverListId(over.id, prev)
      if (!activeCard || overListId === null || activeCard.listId === overListId) return prev

      // 別リストへ入った時点で listId を切り替え、over カードの位置(または末尾)へ差し込む
      const without = prev.filter((c) => c.id !== activeId)
      const moved = { ...activeCard, listId: overListId }
      const overIndex = without.findIndex((c) => c.id === over.id)
      if (overIndex >= 0) {
        return [...without.slice(0, overIndex), moved, ...without.slice(overIndex)]
      }
      return [...without, moved]
    })
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const snapshot = snapshotRef.current
    snapshotRef.current = null
    setActiveCardId(null)

    const activeId = Number(active.id)
    let next = cards
    if (over && over.id !== active.id) {
      const oldIndex = cards.findIndex((c) => c.id === activeId)
      const newIndex = cards.findIndex((c) => c.id === over.id)
      const activeCard = cards[oldIndex]
      const overCard = cards[newIndex]
      if (activeCard && overCard && activeCard.listId === overCard.listId) {
        next = arrayMove(cards, oldIndex, newIndex)
      }
    }

    const moved = next.find((c) => c.id === activeId)
    if (!moved || !snapshot) return
    const position = next.filter((c) => c.listId === moved.listId).findIndex((c) => c.id === activeId)
    const before = snapshot.find((c) => c.id === activeId)
    const beforePosition = snapshot.filter((c) => c.listId === before?.listId).findIndex((c) => c.id === activeId)
    setCards(next)
    if (before && before.listId === moved.listId && beforePosition === position) return

    try {
      await moveCard(activeId, { listId: moved.listId, position })
    } catch (err) {
      setCards(snapshot)
      setError(err instanceof Error ? err.message : 'カードの移動に失敗しました')
    }
  }

  function handleDragCancel() {
    if (snapshotRef.current) setCards(snapshotRef.current)
    snapshotRef.current = null
    setActiveCardId(null)
  }

  const activeCard = cards.find((c) => c.id === activeCardId) ?? null

  const cardsByListId = new Map<number, CardDto[]>()
  for (const card of cards) {
    const existing = cardsByListId.get(card.listId)
    if (existing) {
      existing.push(card)
    } else {
      cardsByListId.set(card.listId, [card])
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>タスクボード</h1>
        <SearchForm filters={filters} onChange={setFilters} />
      </header>

      {error && <p className="app-error">{error}</p>}
      {loading && <p className="app-loading">読み込み中...</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <main className="board">
          {lists.map((list) => (
            <BoardColumn
              key={list.id}
              list={list}
              cards={cardsByListId.get(list.id) ?? []}
              onCardUpdate={handleCardUpdate}
              onListUpdate={handleListUpdate}
              dragDisabled={dragDisabled}
            />
          ))}
        </main>
        <DragOverlay>
          {activeCard && (
            <div className={`card-item priority-${activeCard.priority} drag-overlay`}>
              <p className="card-item-text">{activeCard.text}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default App
