import type { Author } from '@/data/types'
import { cn } from '@/lib/utils'

interface AuthorBylineProps {
  author: Author
  size?: 'sm' | 'md'
  className?: string
}

function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/128?u=${encodeURIComponent(seed)}`
}

export function AuthorByline({ author, size = 'md', className }: AuthorBylineProps) {
  const avatarSize = size === 'sm' ? 'size-8' : 'size-10'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src={avatarUrl(author.avatarSeed)}
        alt=""
        width={128}
        height={128}
        loading="lazy"
        className={cn('shrink-0 rounded-full border border-line object-cover', avatarSize)}
        aria-hidden="true"
      />
      <span className="leading-tight">
        <span className="block font-body text-sm text-text">{author.name}</span>
        <span className="block font-mono text-[11px] uppercase tracking-widest text-muted">
          {author.role}
        </span>
      </span>
    </div>
  )
}
