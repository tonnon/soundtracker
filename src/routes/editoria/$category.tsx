import { useState } from 'react'
import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { isCategory, CATEGORY_META } from '@/lib/category'
import type { Category } from '@/data/types'
import { getByCategory, countByCategory, getCueNumber } from '@/services/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { ArticleGridSkeleton } from '@/components/ArticleSkeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/editoria/$category')({
  loader: ({ params }) => {
    if (!isCategory(params.category)) {
      throw notFound()
    }
  },
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
  pendingComponent: () => (
    <div className="container-editorial py-10 md:py-14">
      <ArticleGridSkeleton />
    </div>
  ),
})

const PAGE_SIZE = 6

function CategoryPage() {
  const params = Route.useParams()
  const category = params.category as Category
  // Remounts (and resets pagination state) whenever the category changes.
  return <CategoryView key={category} category={category} />
}

function CategoryView({ category }: { category: Category }) {
  const meta = CATEGORY_META[category]
  const total = countByCategory(category)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useDocumentTitle(meta.label, meta.description)

  const articles = getByCategory(category, { limit: visibleCount })
  const hasMore = visibleCount < total

  return (
    <div className="container-editorial space-y-10 py-10 md:py-14">
      <header className={cn('space-y-3 border-l-2 pl-5', meta.border)}>
        <h1 className={cn('font-display text-3xl font-bold sm:text-4xl', meta.text)}>{meta.label}</h1>
        <p className="max-w-xl text-muted">{meta.description}</p>
      </header>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} cueNumber={getCueNumber(article.slug)} />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                Carregar mais
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState
          title="Ainda não há matérias nesta editoria"
          description="Volte em breve — novas notícias são publicadas regularmente."
        />
      )}
    </div>
  )
}

function CategoryNotFound() {
  return (
    <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Erro 404</p>
      <h1 className="font-display text-3xl font-bold text-text">Editoria não encontrada</h1>
      <p className="max-w-sm text-muted">
        Essa editoria não existe. Confira as opções disponíveis: Cinema, Séries ou Games.
      </p>
      <Button asChild>
        <Link to="/">Voltar para a home</Link>
      </Button>
    </div>
  )
}
