import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  defaultValue?: string
  onQueryChange: (query: string) => void
  autoFocus?: boolean
  debounceMs?: number
  className?: string
}

export function SearchInput({
  defaultValue = '',
  onQueryChange,
  autoFocus = false,
  debounceMs = 250,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => onQueryChange(value), debounceMs)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
  }

  return (
    <label
      className={cn(
        'flex items-center gap-3 rounded-sm border border-line bg-surface px-4 py-3 focus-within:border-amber',
        className,
      )}
    >
      <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
      <span className="sr-only">Search news</span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search by composer, film, series or game…"
        className="w-full bg-transparent text-base text-text placeholder:text-muted focus:outline-none"
      />
    </label>
  )
}
