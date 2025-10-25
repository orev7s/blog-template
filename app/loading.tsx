export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">
      {/* Hero section skeleton */}
      <section className="mb-6">
        <div className="h-10 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-5 w-1/2 animate-pulse rounded-md bg-muted" />
      </section>

      {/* Category tabs skeleton */}
      <nav className="mb-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        ))}
      </nav>

      {/* Separator */}
      <div className="mb-6 h-px w-full animate-pulse bg-muted" />

      {/* Post cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-7 w-full animate-pulse rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-4/6 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-3 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </main>
  )
}
