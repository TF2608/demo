import { useState, type KeyboardEvent } from 'react'

interface Props {
  onAdd: (title: string) => void
}

export function AddListForm({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')

  function reset() {
    setValue('')
    setIsOpen(false)
  }

  function commit() {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
    }
    reset()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      reset()
    }
  }

  if (!isOpen) {
    return (
      <div className="add-list-wrapper">
        <button className="add-list-btn outer" onClick={() => setIsOpen(true)}>
          + リストを追加
        </button>
      </div>
    )
  }

  return (
    <div className="add-list-wrapper">
      <div className="add-list-form outer">
        <input
          type="text"
          placeholder="リスト名を入力"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="form-actions">
          <button className="btn-primary" onClick={commit}>
            追加
          </button>
          <button className="btn-cancel" onClick={reset}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
