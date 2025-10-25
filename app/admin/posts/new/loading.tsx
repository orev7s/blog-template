export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      {/* Title skeleton */}
      <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
      
      {/* Form skeleton */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        
        {/* Editor skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  )
}
