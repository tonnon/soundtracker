import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { decodeNewsId, fetchCategoryNews } from '@/services/news'
import { CategoryChip } from '@/components/CategoryChip'
import { SourceMeta } from '@/components/SourceMeta'
import { NewsCard } from '@/components/NewsCard'
import { WaveformDivider } from '@/components/WaveformDivider'
import { WaveformProgress } from '@/components/WaveformProgress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArticlePageSkeleton } from '@/components/ArticleSkeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/news/$slug')({
  loader: async ({ params }) => {
    const item = decodeNewsId(params.slug)
    if (!item) {
      throw notFound()
    }
    const related = await fetchCategoryNews(item.category)
      .then((items) => items.filter((candidate) => candidate.id !== item.id).slice(0, 3))
      .catch(() => [])
    return { item, related }
  },
  component: NewsPage,
  notFoundComponent: NewsNotFound,
  pendingComponent: ArticlePageSkeleton,
})

function NewsPage() {
  const { item, related } = Route.useLoaderData()

  useDocumentTitle(item.title, item.description ?? `Read the full story on ${item.domain}.`)

  return (
    <div>
      <WaveformProgress seed={item.id} category={item.category} />

      <article className="container-editorial max-w-3xl space-y-8 py-10 md:py-14">
        <header className="space-y-4">
          <CategoryChip category={item.category} size="md" />
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {item.title}
          </h1>
          <SourceMeta domain={item.domain} publishedAt={item.publishedAt} className="text-sm" />
        </header>

        <div className="aspect-video overflow-hidden rounded-sm border border-line">
          <img src={item.image} alt="" loading="eager" className="size-full object-cover" />
        </div>

        {item.description ? (
          <p className="text-balance text-lg leading-relaxed text-text">{item.description}</p>
        ) : null}

        <p className="text-sm text-muted">
          This is a summary of a third-party story from {item.domain}. soundtracker doesn't republish the
          original article in full — read the complete coverage directly at the source.
        </p>

        <Button asChild size="lg">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read the full story on {item.domain}
            <ExternalLink className="ml-1 size-4" aria-hidden="true" />
          </a>
        </Button>

        <Separator />
      </article>

      {related.length > 0 ? (
        <section className="container-editorial max-w-3xl space-y-6 pb-16" aria-labelledby="related-heading">
          <WaveformDivider seed={`related-${item.id}`} />
          <h2 id="related-heading" className="font-display text-xl font-bold text-text">
            Related
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((candidate) => (
              <NewsCard key={candidate.id} item={candidate} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function NewsNotFound() {
  return (
    <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Error 404</p>
      <h1 className="font-display text-3xl font-bold text-text">Story not found</h1>
      <p className="max-w-sm text-muted">
        This link looks invalid or incomplete. Go back to the home page and pick a story from the list.
      </p>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
