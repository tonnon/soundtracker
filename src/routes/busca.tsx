import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { searchArticles, getCueNumber } from '@/services/articles'
import { SearchInput } from '@/components/SearchInput'
import { ArticleCard } from '@/components/ArticleCard'
import { EmptyState } from '@/components/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

interface BuscaSearch {
  q?: string
}

export const Route = createFileRoute('/busca')({
  validateSearch: (search: Record<string, unknown>): BuscaSearch => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: SearchPage,
})

function SearchPage() {
  const { q } = Route.useSearch()
  const [query, setQuery] = useState(q ?? '')
  useDocumentTitle('Busca', 'Busque por compositor, filme, série ou jogo.')

  const trimmed = query.trim()
  const results = searchArticles(trimmed)

  return (
    <div className="container-editorial max-w-3xl space-y-8 py-10 md:py-14">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-text">Busca</h1>
        <p className="text-muted">Procure por compositor, trilha, filme, série ou jogo.</p>
      </header>

      <SearchInput defaultValue={query} onQueryChange={setQuery} autoFocus />

      {trimmed ? (
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para “{trimmed}”
        </p>
      ) : null}

      {!trimmed ? (
        <EmptyState
          title="Digite para começar a busca"
          description="Experimente o nome de um compositor, filme, série ou jogo."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title={`Nenhum cue encontrado para “${trimmed}”`}
          description="Tente outro termo — um compositor, trilha, filme, série ou jogo."
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} cueNumber={getCueNumber(article.slug)} />
          ))}
        </div>
      )}
    </div>
  )
}
