import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface TagListProps {
  tags: string[]
  className?: string
}

export function TagList({ tags, className }: TagListProps) {
  if (tags.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            to="/busca"
            search={{ q: tag }}
            className="inline-block rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-amber hover:text-amber"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  )
}
