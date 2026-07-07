import { formatDateStamp } from '@/lib/format'
import { cn } from '@/lib/utils'

interface SourceMetaProps {
  domain: string
  publishedAt: string
  className?: string
}

export function SourceMeta({ domain, publishedAt, className }: SourceMetaProps) {
  return (
    <p className={cn('font-mono text-xs uppercase tracking-widest text-muted', className)}>
      {domain} · {formatDateStamp(publishedAt)}
    </p>
  )
}
