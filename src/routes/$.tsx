import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  useDocumentTitle('Track not found')

  return (
    <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Error 404</p>
      <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">Track not found</h1>
      <p className="max-w-sm text-muted">
        This page doesn't exist or has been moved. How about heading back home to find the next story?
      </p>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
