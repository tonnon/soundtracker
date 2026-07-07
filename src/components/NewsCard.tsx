import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ImageOff } from 'lucide-react'
import type { NewsItem } from '@/data/types'
import { CATEGORY_META } from '@/lib/category'
import { generateWaveformBars } from '@/lib/waveform'
import { cn } from '@/lib/utils'
import { CategoryChip } from './CategoryChip'
import { SourceMeta } from './SourceMeta'

type NewsCardVariant = 'hero' | 'default' | 'compact'

interface NewsCardProps {
  item: NewsItem
  variant?: NewsCardVariant
  priority?: boolean
  className?: string
}

function HoverWaveform({ seed }: { seed: string }) {
  const bars = useMemo(() => generateWaveformBars(seed, 6), [seed])

  return (
    <span className="ml-2 inline-flex h-4 items-end gap-0.5 align-middle" aria-hidden="true">
      {bars.map((amplitude, index) => (
        <span
          key={index}
          className="w-0.5 origin-bottom scale-y-0 bg-current transition-transform duration-300 group-hover:scale-y-100"
          style={{ height: `${Math.max(35, amplitude * 100)}%`, transitionDelay: `${index * 25}ms` }}
        />
      ))}
    </span>
  )
}

function CardImage({
  item,
  priority,
  className,
}: {
  item: NewsItem
  priority?: boolean
  className?: string
}) {
  const [broken, setBroken] = useState(false)
  const meta = CATEGORY_META[item.category]

  if (broken) {
    return (
      <div
        className={cn('flex items-center justify-center overflow-hidden rounded-sm border border-line bg-surface', className)}
      >
        <ImageOff className={cn('size-6', meta.text)} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-sm border border-line bg-surface', className)}>
      <img
        src={item.image}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setBroken(true)}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  )
}

export function NewsCard({ item, variant = 'default', priority = false, className }: NewsCardProps) {
  const meta = CATEGORY_META[item.category]

  if (variant === 'hero') {
    return (
      <Link
        to="/news/$slug"
        params={{ slug: item.id }}
        className={cn('group grid gap-8 lg:grid-cols-2 lg:items-center', className)}
      >
        <CardImage item={item} priority={priority} className="aspect-video lg:aspect-[4/3]" />
        <div className="space-y-5">
          <CategoryChip category={item.category} size="md" />
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>
          <SourceMeta domain={item.domain} publishedAt={item.publishedAt} className="text-sm" />
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to="/news/$slug"
        params={{ slug: item.id }}
        className={cn('group flex items-center gap-4 border-l-2 pl-4', meta.border, className)}
      >
        <CardImage item={item} className="aspect-square w-16 shrink-0 sm:w-20" />
        <div className="min-w-0 space-y-1.5">
          <SourceMeta domain={item.domain} publishedAt={item.publishedAt} className="text-[10px]" />
          <p
            className={cn(
              'line-clamp-2 font-display text-sm font-semibold leading-snug text-text',
              meta.groupHoverText,
            )}
          >
            {item.title}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link to="/news/$slug" params={{ slug: item.id }} className={cn('group flex flex-col gap-3', className)}>
      <CardImage item={item} className="aspect-video" />
      <CategoryChip category={item.category} />
      <h3
        className={cn(
          'line-clamp-3 font-display text-xl font-semibold leading-snug text-text',
          meta.groupHoverText,
        )}
      >
        {item.title}
        <HoverWaveform seed={item.id} />
      </h3>
      <SourceMeta domain={item.domain} publishedAt={item.publishedAt} />
    </Link>
  )
}
