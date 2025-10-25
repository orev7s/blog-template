export type PrefetchTask = () => void

interface IdleDeadline {
  didTimeout: boolean
  timeRemaining(): number
}

type IdleCallbackHandle = number

type IdleCallbackOptions = {
  timeout?: number
}

declare global {
  interface Window {
    requestIdleCallback?: (callback: (deadline: IdleDeadline) => void, opts?: IdleCallbackOptions) => IdleCallbackHandle
  }
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

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(
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
