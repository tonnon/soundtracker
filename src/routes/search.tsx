import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { searchNews } from '@/services/news'
import { SearchInput } from '@/components/SearchInput'
import { NewsCard } from '@/components/NewsCard'
import { EmptyState } from '@/components/EmptyState'
import { ArticleGridSkeleton } from '@/components/ArticleSkeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { NewsItem } from '@/data/types'

interface SearchParams {
  q?: string
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: SearchPage,
})

interface Outcome {
  query: string
  ok: boolean
  items: NewsItem[]
}

function SearchPage() {
  const { q } = Route.useSearch()
  const [query, setQuery] = useState(q ?? '')
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  useDocumentTitle('Search', 'Search real news by composer, film, series or game.')

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }
    let cancelled = false
    searchNews(trimmed)
      .then((items) => {
        if (cancelled) return
        setOutcome({ query: trimmed, ok: true, items })
      })
      .catch(() => {
        if (cancelled) return
        setOutcome({ query: trimmed, ok: false, items: [] })
      })
    return () => {
      cancelled = true
    }
  }, [query])

  const trimmed = query.trim()
  const isLoading = trimmed !== '' && outcome?.query !== trimmed
  const results = outcome?.query === trimmed && outcome.ok ? outcome.items : []
  const hasError = outcome?.query === trimmed && !outcome.ok

  return (
    <div className="container-editorial max-w-3xl space-y-8 py-10 md:py-14">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-text">Search</h1>
        <p className="text-muted">Look up real news by composer, soundtrack, film, series or game.</p>
      </header>

      <SearchInput defaultValue={query} onQueryChange={setQuery} autoFocus />

      {trimmed && !isLoading && !hasError ? (
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {results.length} {results.length === 1 ? 'result' : 'results'} for “{trimmed}”
        </p>
      ) : null}

      {!trimmed ? (
        <EmptyState
          title="Type to start searching"
          description="Try the name of a composer, film, series or game."
        />
      ) : isLoading ? (
        <ArticleGridSkeleton count={4} />
      ) : hasError ? (
        <EmptyState
          title="Couldn't search right now"
          description="The news source may be temporarily unavailable or rate-limiting requests. Try again in a moment."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title={`No news found for “${trimmed}”`}
          description="Try another term — a composer, soundtrack, film, series or game."
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {results.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
