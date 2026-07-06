import { Skeleton } from '@/components/ui/skeleton'

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}

interface ArticleGridSkeletonProps {
  count?: number
}

export function ArticleGridSkeleton({ count = 6 }: ArticleGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function ArticlePageSkeleton() {
  return (
    <div className="container-editorial max-w-3xl space-y-6 py-12">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}
