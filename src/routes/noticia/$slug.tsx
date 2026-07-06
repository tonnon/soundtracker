import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { getBySlug, getCueNumber, getRelated } from '@/services/articles'
import { CategoryChip } from '@/components/CategoryChip'
import { CueMeta } from '@/components/CueMeta'
import { AuthorByline } from '@/components/AuthorByline'
import { WaveformProgress } from '@/components/WaveformProgress'
import { TagList } from '@/components/TagList'
import { ArticleCard } from '@/components/ArticleCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArticlePageSkeleton } from '@/components/ArticleSkeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/noticia/$slug')({
  loader: ({ params }) => {
    const article = getBySlug(params.slug)
    if (!article) {
      throw notFound()
    }
    return { article }
  },
  component: ArticlePage,
  notFoundComponent: ArticleNotFound,
  pendingComponent: ArticlePageSkeleton,
})

function ArticlePage() {
  const { article } = Route.useLoaderData()
  const related = getRelated(article)

  useDocumentTitle(article.title, article.excerpt)

  return (
    <div>
      <WaveformProgress seed={article.slug} category={article.category} />

      <article className="container-editorial max-w-3xl space-y-8 py-10 md:py-14">
        <header className="space-y-4">
          <CategoryChip category={article.category} size="md" />
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <AuthorByline author={article.author} size="sm" />
            <CueMeta
              cueNumber={getCueNumber(article.slug)}
              publishedAt={article.publishedAt}
              readingTimeMin={article.readingTimeMin}
            />
          </div>
        </header>

        <div className="aspect-video overflow-hidden rounded-sm border border-line">
          <img
            src={article.coverImage}
            alt={article.title}
            loading="eager"
            width={1200}
            height={675}
            className="size-full object-cover"
          />
        </div>

        <div className="max-w-[68ch] space-y-6 text-base leading-relaxed text-text sm:text-lg">
          {article.content.map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="pt-2 font-display text-xl font-semibold text-text sm:text-2xl">
                  {paragraph.slice(3)}
                </h2>
              )
            }
            return (
              <p key={index} className="whitespace-pre-line text-muted">
                {paragraph}
              </p>
            )
          })}
        </div>

        <Separator />

        <TagList tags={article.tags} />
      </article>

      {related.length > 0 ? (
        <section className="container-editorial max-w-3xl space-y-6 pb-16" aria-labelledby="related-heading">
          <Separator />
          <h2 id="related-heading" className="font-display text-xl font-bold text-text">
            Relacionadas
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} cueNumber={getCueNumber(item.slug)} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function ArticleNotFound() {
  return (
    <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Erro 404</p>
      <h1 className="font-display text-3xl font-bold text-text">Notícia não encontrada</h1>
      <p className="max-w-sm text-muted">
        Essa matéria pode ter sido movida ou o link está incorreto. Explore as últimas notícias na home.
      </p>
      <Button asChild>
        <Link to="/">Voltar para a home</Link>
      </Button>
    </div>
  )
}
