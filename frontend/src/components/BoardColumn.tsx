import type { CardDto, ListDto } from '../api/types'
import { CardItem } from './CardItem'

interface BoardColumnProps {
  list: ListDto
  cards: CardDto[]
}

export function BoardColumn({ list, cards }: BoardColumnProps) {
  return (
    <div className="board-column">
      <div className="board-column-header">
        <h2>{list.title}</h2>
        <span className="board-column-count">{cards.length}</span>
      </div>
      <div className="board-column-cards">
        {cards.length === 0 ? (
          <p className="board-column-empty">該当するカードはありません</p>
        ) : (
          cards.map((card) => <CardItem key={card.id} card={card} />)
        )}
      </div>
    </div>
  )
}
