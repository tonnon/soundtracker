import { useState } from 'react'
import { createFileRoute, notFound, Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { isCategory, CATEGORY_META } from '@/lib/category'
import type { Category, NewsItem } from '@/data/types'
import { fetchCategoryNews } from '@/services/news'
import { NewsCard } from '@/components/NewsCard'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { ArticleGridSkeleton } from '@/components/ArticleSkeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/category/$category')({
  loader: ({ params }) => {
    if (!isCategory(params.category)) {
      throw notFound()
    }
    return fetchCategoryNews(params.category)
  },
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
  errorComponent: CategoryError,
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
  const items = Route.useLoaderData()
  // Remounts (and resets pagination state) whenever the category changes.
  return <CategoryView key={category} category={category} items={items} />
}

function CategoryView({ category, items }: { category: Category; items: NewsItem[] }) {
  const meta = CATEGORY_META[category]
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useDocumentTitle(meta.label, meta.description)

  const visible = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  return (
    <div className="container-editorial space-y-10 py-10 md:py-14">
      <header className={cn('space-y-3 border-l-2 pl-5', meta.border)}>
        <h1 className={cn('font-display text-3xl font-bold sm:text-4xl', meta.text)}>{meta.label}</h1>
        <p className="max-w-xl text-muted">{meta.description}</p>
      </header>

      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {visible.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                Load more
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState
          title="No news found in this section right now"
          description="The news source may not have recent coverage for this topic. Check back soon."
        />
      )}
    </div>
  )
}

function CategoryNotFound() {
  return (
    <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Error 404</p>
      <h1 className="font-display text-3xl font-bold text-text">Section not found</h1>
      <p className="max-w-sm text-muted">
        This section doesn't exist. Check the available options: Cinema, Series, or Games.
      </p>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}

function CategoryError({ reset }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="container-editorial py-10 md:py-14">
      <EmptyState
        title="Couldn't load this section"
        description="The news source may be temporarily unavailable or rate-limiting requests. Wait a few seconds and try again."
        action={
          <Button
            variant="outline"
            onClick={() => {
              router.invalidate()
              reset()
            }}
          >
            Try again
          </Button>
        }
      />
    </div>
  )
}
