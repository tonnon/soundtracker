import type { ReactNode } from 'react'
import { AudioLines } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-sm border border-line px-6 py-16 text-center',
        className,
      )}
    >
      <AudioLines className="size-8 text-muted" aria-hidden="true" />
      <div className="space-y-1.5">
        <p className="font-display text-lg font-semibold text-text">{title}</p>
        {description ? <p className="mx-auto max-w-sm text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
