import { useState, type KeyboardEvent } from 'react'

interface Props {
  onAdd: (text: string) => void
}

export function AddCardForm({ onAdd }: Props) {
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

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      reset()
    }
  }

  if (!isOpen) {
    return (
      <button className="add-card-btn" onClick={() => setIsOpen(true)}>
        + カードを追加
      </button>
    )
  }

  return (
    <div className="add-card-form">
      <textarea
        rows={2}
        placeholder="カードの内容を入力"
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
  )
}
