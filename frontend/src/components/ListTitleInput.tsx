import { useState, type KeyboardEvent } from 'react'

interface Props {
  title: string
  onCommit: (title: string) => void
}

export function ListTitleInput({ title, onCommit }: Props) {
  const [value, setValue] = useState(title)

  function commit(e: React.FocusEvent<HTMLInputElement>) {
    const trimmed = e.target.value.trim()
    if (trimmed && trimmed !== title) {
      onCommit(trimmed)
    } else {
      setValue(title)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  return (
    <input
      className="list-title"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
    />
  )
}
