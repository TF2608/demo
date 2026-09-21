import { useEffect, useState } from 'react'
import { searchCards } from './api/cards'
import { getLists } from './api/lists'
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

      <main className="board">
        {lists.map((list) => (
          <BoardColumn key={list.id} list={list} cards={cardsByListId.get(list.id) ?? []} />
        ))}
      </main>
    </div>
  )
}

export default App
