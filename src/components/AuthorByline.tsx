import type { Author } from '@/data/types'
import { cn } from '@/lib/utils'

interface AuthorBylineProps {
  author: Author
  size?: 'sm' | 'md'
  className?: string
}

const AVATAR_TONES = ['bg-amber/20 text-amber', 'bg-signal/20 text-signal', 'bg-rec/20 text-rec']

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

function hashToTone(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % AVATAR_TONES.length
  }
  return AVATAR_TONES[hash] ?? AVATAR_TONES[0]!
}

export function AuthorByline({ author, size = 'md', className }: AuthorBylineProps) {
  const avatarSize = size === 'sm' ? 'size-8 text-xs' : 'size-10 text-sm'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-display font-semibold',
          avatarSize,
          hashToTone(author.avatarSeed),
        )}
        aria-hidden="true"
      >
        {getInitials(author.name)}
      </span>
      <span className="leading-tight">
        <span className="block font-body text-sm text-text">{author.name}</span>
        <span className="block font-mono text-[11px] uppercase tracking-widest text-muted">
          {author.role}
        </span>
      </span>
    </div>
  )
}
