export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 px-4">
        {/* Title skeleton */}
        <div className="h-8 w-32 animate-pulse rounded-md bg-muted mx-auto" />
        
        {/* Card skeleton */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        </div>
        
        {/* Link skeleton */}
        <div className="h-4 w-48 animate-pulse rounded-md bg-muted mx-auto" />
      </div>
    </div>
  )
}
