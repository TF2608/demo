import type { CardDto } from '../api/types'

const PRIORITY_LABEL: Record<CardDto['priority'], string> = {
  high: '高',
  mid: '中',
  low: '低',
}

export function CardItem({ card }: { card: CardDto }) {
  return (
    <div className={`card-item priority-${card.priority}${card.done ? ' done' : ''}`}>
      <p className="card-item-text">{card.text}</p>
      <div className="card-item-meta">
        <span className="card-item-priority">優先度: {PRIORITY_LABEL[card.priority]}</span>
        <span className="card-item-status">{card.done ? '完了' : '未完了'}</span>
      </div>
    </div>
  )
}
