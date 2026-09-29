import { useState } from 'react'
import type { UpdateCardPayload } from '../api/cards'
import type { UpdateListPayload } from '../api/lists'
import type { CardDto, ListDto } from '../api/types'
import { CardItem } from './CardItem'

interface BoardColumnProps {
  list: ListDto
  cards: CardDto[]
  onCardUpdate: (id: number, payload: UpdateCardPayload) => Promise<void>
  onListUpdate: (id: number, payload: UpdateListPayload) => Promise<void>
}

export function BoardColumn({ list, cards, onCardUpdate, onListUpdate }: BoardColumnProps) {
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
      <div className="board-column-cards">
        {cards.length === 0 ? (
          <p className="board-column-empty">該当するカードはありません</p>
        ) : (
          cards.map((card) => <CardItem key={card.id} card={card} onUpdate={onCardUpdate} />)
        )}
      </div>
    </div>
  )
}
