import { useState, type KeyboardEvent } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CardDto, Priority } from '../types'

interface Props {
  card: CardDto
  onToggleDone: (done: boolean) => void
  onEditText: (text: string) => void
  onChangePriority: (priority: Priority) => void
  onDelete: () => void
}

export function Card({ card, onToggleDone, onEditText, onChangePriority, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(card.text)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: 'card', listId: card.listId, cardId: card.id },
    disabled: isEditing,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function startEdit() {
    setDraftText(card.text)
    setIsEditing(true)
  }

  function commitEdit() {
    const trimmed = draftText.trim()
    if (trimmed) {
      onEditText(trimmed)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      commitEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={'card' + (isDragging ? ' dragging' : '')}
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
    >
      <div className="card-row">
        <input
          type="checkbox"
          checked={card.done}
          onChange={(e) => onToggleDone(e.target.checked)}
        />
        {isEditing ? (
          <textarea
            className="card-edit"
            rows={2}
            autoFocus
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitEdit}
          />
        ) : (
          <div className={'card-text' + (card.done ? ' done' : '')} onClick={startEdit}>
            {card.text}
          </div>
        )}
        <button className="card-delete" onClick={onDelete}>
          ×
        </button>
      </div>
      <select
        className={`priority-select priority-${card.priority}`}
        value={card.priority}
        onChange={(e) => onChangePriority(e.target.value as Priority)}
      >
        <option value="high">高</option>
        <option value="mid">中</option>
        <option value="low">低</option>
      </select>
    </div>
  )
}
