export async function promiseAll<T extends Record<string, Promise<unknown>>>(
  promiseObject: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> } | null> {
  const entries = Object.entries(promiseObject)
  if (entries.length === 0) {
    return null
  }
  const propertyNames = entries.map(entry => entry[0])
  const promiseValues = entries.map(entry => entry[1] as T[keyof T])

  const resolvedValues = await Promise.all(promiseValues)
  return Object.fromEntries(propertyNames.map((name, index) => [name, resolvedValues[index]])) as { [K in keyof T]: Awaited<T[K]> }
}
