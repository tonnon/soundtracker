import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { Article } from '@/data/types'
import { CATEGORY_META } from '@/lib/category'
import { generateWaveformBars } from '@/lib/waveform'
import { cn } from '@/lib/utils'
import { CategoryChip } from './CategoryChip'
import { CueMeta } from './CueMeta'
import { AuthorByline } from './AuthorByline'

type ArticleCardVariant = 'hero' | 'default' | 'compact'

interface ArticleCardProps {
  article: Article
  cueNumber: number
  variant?: ArticleCardVariant
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
  article,
  priority,
  className,
}: {
  article: Article
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cn('overflow-hidden rounded-sm border border-line bg-surface', className)}>
      <img
        src={article.coverImage}
        alt={article.title}
        loading={priority ? 'eager' : 'lazy'}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        width={1200}
        height={675}
      />
    </div>
  )
}

export function ArticleCard({
  article,
  cueNumber,
  variant = 'default',
  priority = false,
  className,
}: ArticleCardProps) {
  const meta = CATEGORY_META[article.category]

  if (variant === 'hero') {
    return (
      <Link
        to="/noticia/$slug"
        params={{ slug: article.slug }}
        className={cn('group grid gap-8 md:grid-cols-2 md:items-center', className)}
      >
        <CardImage article={article} priority={priority} className="aspect-video md:aspect-[4/3]" />
        <div className="space-y-5">
          <CategoryChip category={article.category} size="md" />
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="max-w-prose text-base text-muted sm:text-lg">{article.excerpt}</p>
          <CueMeta
            cueNumber={cueNumber}
            publishedAt={article.publishedAt}
            readingTimeMin={article.readingTimeMin}
          />
          <AuthorByline author={article.author} />
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to="/noticia/$slug"
        params={{ slug: article.slug }}
        className={cn('group flex items-center gap-4', className)}
      >
        <CardImage article={article} className="aspect-square w-16 shrink-0 sm:w-20" />
        <div className="min-w-0 space-y-1.5">
          <CueMeta
            cueNumber={cueNumber}
            publishedAt={article.publishedAt}
            readingTimeMin={article.readingTimeMin}
            className="text-[10px]"
          />
          <p
            className={cn(
              'line-clamp-2 font-display text-sm font-semibold leading-snug text-text',
              meta.groupHoverText,
            )}
          >
            {article.title}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link to="/noticia/$slug" params={{ slug: article.slug }} className={cn('group flex flex-col gap-3', className)}>
      <CardImage article={article} className="aspect-video" />
      <CategoryChip category={article.category} />
      <h3
        className={cn(
          'flex items-center font-display text-xl font-semibold leading-snug text-text',
          meta.groupHoverText,
        )}
      >
        {article.title}
        <HoverWaveform seed={article.slug} />
      </h3>
      <p className="line-clamp-2 text-sm text-muted">{article.excerpt}</p>
      <CueMeta cueNumber={cueNumber} publishedAt={article.publishedAt} readingTimeMin={article.readingTimeMin} />
    </Link>
  )
}
