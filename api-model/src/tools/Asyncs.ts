import type { dynamic } from '@compose/api-types'

export async function promiseAll<T extends Record<string, dynamic>>(taskObj: T): Promise<{ [K in keyof T]: Awaited<T[K]> } | null> {
  const e = Object.entries(taskObj)
  if (e.length === 0)
    return null
  const keys = e.map(e => e[0])
  const tasks = e.map(e => e[1])

  const result = await Promise.all(tasks)
  return Object.fromEntries(keys.map((k, i) => [k, result[i]])) as { [K in keyof T]: Awaited<T[K]> }
}
