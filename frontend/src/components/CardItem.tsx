import { useState } from 'react'
import type { UpdateCardPayload } from '../api/cards'
import type { CardDto, Priority } from '../api/types'

const PRIORITY_LABEL: Record<CardDto['priority'], string> = {
  high: '高',
  mid: '中',
  low: '低',
}

interface CardItemProps {
  card: CardDto
  onUpdate: (id: number, payload: UpdateCardPayload) => Promise<void>
}

export function CardItem({ card, onUpdate }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(card.text)
  const [priority, setPriority] = useState<Priority>(card.priority)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleToggleDone() {
    setSaving(true)
    setError(null)
    try {
      await onUpdate(card.id, { done: !card.done })
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  function startEditing() {
    setText(card.text)
    setPriority(card.priority)
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
      await onUpdate(card.id, { text, priority })
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (isEditing) {
    return (
      <div className={`card-item priority-${card.priority}${card.done ? ' done' : ''}`}>
        <input
          className="card-item-edit-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={saving}
        />
        <select
          className="card-item-edit-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          disabled={saving}
        >
          <option value="high">高</option>
          <option value="mid">中</option>
          <option value="low">低</option>
        </select>
        {error && <p className="card-item-error">{error}</p>}
        <div className="card-item-edit-actions">
          <button onClick={handleSave} disabled={saving || text.trim() === ''}>
            保存
          </button>
          <button onClick={cancelEditing} disabled={saving}>
            キャンセル
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`card-item priority-${card.priority}${card.done ? ' done' : ''}`}>
      <p className="card-item-text" onClick={startEditing}>
        {card.text}
      </p>
      <div className="card-item-meta">
        <span className="card-item-priority">優先度: {PRIORITY_LABEL[card.priority]}</span>
        <label className="card-item-status">
          <input type="checkbox" checked={card.done} onChange={handleToggleDone} disabled={saving} />
          {card.done ? '完了' : '未完了'}
        </label>
      </div>
      {error && <p className="card-item-error">{error}</p>}
    </div>
  )
}
