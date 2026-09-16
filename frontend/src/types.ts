export type Priority = 'high' | 'mid' | 'low'

export interface CardDto {
  id: number
  listId: number
  text: string
  done: boolean
  priority: Priority
  position: number
}

export interface ListDto {
  id: number
  title: string
  position: number
  cards: CardDto[]
}

export interface BoardDto {
  lists: ListDto[]
}
