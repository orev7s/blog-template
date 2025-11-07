export type PrefetchTask = () => void

// Type for requestIdleCallback if not available in the environment
type RequestIdleCallbackHandle = number
type RequestIdleCallbackDeadline = {
  didTimeout: boolean
  timeRemaining(): number
}
type RequestIdleCallbackOptions = {
  timeout?: number
}

export function schedulePrefetch(task: PrefetchTask, delay = 0) {
  if (typeof window === "undefined") {
    return
  }

  const runTask = () => {
    try {
      task()
    } catch {
      /* noop */
    }
  }

  // Use type assertion to handle requestIdleCallback
  const requestIdleCallback = (window as any).requestIdleCallback as 
    ((callback: (deadline: RequestIdleCallbackDeadline) => void, options?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle) | undefined
  
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(
      () => {
        runTask()
      },
      { timeout: Math.max(100, delay + 100) }
    )
  } else if (delay > 0) {
    window.setTimeout(runTask, delay)
  } else {
    window.setTimeout(runTask, 0)
  }
}
