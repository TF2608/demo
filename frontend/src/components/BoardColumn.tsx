import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { UpdateCardPayload } from '../api/cards'
import type { UpdateListPayload } from '../api/lists'
import type { CardDto, ListDto } from '../api/types'
import { CardItem } from './CardItem'

interface BoardColumnProps {
  list: ListDto
  cards: CardDto[]
  onCardUpdate: (id: number, payload: UpdateCardPayload) => Promise<void>
  onListUpdate: (id: number, payload: UpdateListPayload) => Promise<void>
  dragDisabled?: boolean
}

// App.tsx の resolveOverListId が 'list-' 接頭辞で判定しているので合わせること
const listDroppableId = (listId: number) => `list-${listId}`

export function BoardColumn({ list, cards, onCardUpdate, onListUpdate, dragDisabled = false }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: listDroppableId(list.id), disabled: dragDisabled })
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startEditing() {
    setTitle(list.title)
    setError(null)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setError(null)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await onListUpdate(list.id, { title })
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="board-column">
      <div className="board-column-header">
        {isEditing ? (
          <div className="board-column-title-edit">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
            />
            <button onClick={handleSave} disabled={saving || title.trim() === ''}>
              保存
            </button>
            <button onClick={cancelEditing} disabled={saving}>
              キャンセル
            </button>
          </div>
        ) : (
          <h2 onClick={startEditing}>{list.title}</h2>
        )}
        <span className="board-column-count">{cards.length}</span>
      </div>
      {error && <p className="board-column-error">{error}</p>}
      <div ref={setNodeRef} className={`board-column-cards${isOver ? ' drop-target' : ''}`}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <p className="board-column-empty">該当するカードはありません</p>
          ) : (
            cards.map((card) => (
              <CardItem key={card.id} card={card} onUpdate={onCardUpdate} dragDisabled={dragDisabled} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
