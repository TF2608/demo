import type { ChangeEvent } from 'react'
import type { Priority } from '../api/types'

export interface SearchFilters {
  text: string
  priority: Priority | ''
  done: 'all' | 'done' | 'not-done'
}

interface SearchFormProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
}

export function SearchForm({ filters, onChange }: SearchFormProps) {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, text: event.target.value })
  }

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, priority: event.target.value as Priority | '' })
  }

  const handleDoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, done: event.target.value as SearchFilters['done'] })
  }

  return (
    <form className="search-form" onSubmit={(event) => event.preventDefault()}>
      <input
        type="text"
        placeholder="テキストで検索"
        value={filters.text}
        onChange={handleTextChange}
      />

      <select value={filters.priority} onChange={handlePriorityChange}>
        <option value="">優先度: すべて</option>
        <option value="high">高</option>
        <option value="mid">中</option>
        <option value="low">低</option>
      </select>

      <select value={filters.done} onChange={handleDoneChange}>
        <option value="all">状態: すべて</option>
        <option value="not-done">未完了</option>
        <option value="done">完了</option>
      </select>
    </form>
  )
}
