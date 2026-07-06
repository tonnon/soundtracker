import { formatCueSheet } from '@/lib/format'
import { cn } from '@/lib/utils'

interface CueMetaProps {
  cueNumber: number
  publishedAt: string
  readingTimeMin: number
  className?: string
}

export function CueMeta({ cueNumber, publishedAt, readingTimeMin, className }: CueMetaProps) {
  return (
    <p className={cn('font-mono text-xs uppercase tracking-widest text-muted', className)}>
      {formatCueSheet(cueNumber, publishedAt, readingTimeMin)}
    </p>
  )
}
