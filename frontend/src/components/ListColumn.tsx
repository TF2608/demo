import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ListDto, Priority } from '../types'
import { Card } from './Card'
import { AddCardForm } from './AddCardForm'
import { ListTitleInput } from './ListTitleInput'

interface Props {
  list: ListDto
  onRename: (title: string) => void
  onDelete: () => void
  onAddCard: (text: string) => void
  onToggleCardDone: (cardId: number, done: boolean) => void
  onEditCardText: (cardId: number, text: string) => void
  onChangeCardPriority: (cardId: number, priority: Priority) => void
  onDeleteCard: (cardId: number) => void
}

export function ListColumn({
  list,
  onRename,
  onDelete,
  onAddCard,
  onToggleCardDone,
  onEditCardText,
  onChangeCardPriority,
  onDeleteCard,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `list-${list.id}`,
    data: { type: 'list', listId: list.id },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list-cards-${list.id}`,
    data: { type: 'list-cards', listId: list.id },
  })

  function handleDelete() {
    if (window.confirm(`リスト「${list.title}」を削除しますか?`)) {
      onDelete()
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={'list' + (isDragging ? ' dragging' : '')}>
      <div className="list-header">
        <span className="handle" {...attributes} {...listeners}>
          ⠿
        </span>
        <ListTitleInput title={list.title} onCommit={onRename} />
        <span className="count-badge">{list.cards.length}</span>
        <button className="list-delete" onClick={handleDelete}>
          ×
        </button>
      </div>

      <div className="cards" ref={setDroppableRef}>
        <SortableContext
          items={list.cards.map((c) => `card-${c.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onToggleDone={(done) => onToggleCardDone(card.id, done)}
              onEditText={(text) => onEditCardText(card.id, text)}
              onChangePriority={(priority) => onChangeCardPriority(card.id, priority)}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </SortableContext>
      </div>

      <AddCardForm onAdd={onAddCard} />
    </div>
  )
}
