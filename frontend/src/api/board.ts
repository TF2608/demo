import { api } from './client'
import type { BoardDto } from '../types'

export function fetchBoard() {
  return api.get<BoardDto>('/board')
}
