export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      {/* Badge and views skeleton */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Title skeleton */}
      <div className="mb-2 h-10 w-3/4 animate-pulse rounded-md bg-muted" />
      
      {/* Date skeleton */}
      <div className="mt-2 h-4 w-32 animate-pulse rounded-md bg-muted" />

      {/* Separator */}
      <div className="my-6 h-px w-full animate-pulse bg-muted" />

      {/* Content skeleton */}
      <article className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-9/12 animate-pulse rounded-md bg-muted" />
        <div className="mt-6 h-64 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded-md bg-muted" />
      </article>

      {/* Reaction buttons skeleton */}
      <div className="mt-8 flex items-center gap-3">
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Comments section skeleton */}
      <section className="mt-8">
        <div className="mb-3 h-6 w-28 animate-pulse rounded-md bg-muted" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-md border bg-card p-4 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
