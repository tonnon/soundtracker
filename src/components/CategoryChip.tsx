import type { Category } from '@/data/types'
import { CATEGORY_META } from '@/lib/category'
import { cn } from '@/lib/utils'

interface CategoryChipProps {
  category: Category
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryChip({ category, size = 'sm', className }: CategoryChipProps) {
  const meta = CATEGORY_META[category]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono uppercase tracking-widest',
        meta.text,
        size === 'sm' ? 'text-[11px]' : 'text-xs',
        className,
      )}
    >
      <span className={cn('inline-block size-1.5 rounded-full', meta.bg)} aria-hidden="true" />
      {meta.label}
    </span>
  )
}
