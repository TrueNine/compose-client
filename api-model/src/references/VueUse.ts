import type { dynamic, nil, task } from '@compose/api-types'
import type { UseFetchReturn } from '@vueuse/core'

/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
export async function eagerFetch<T = dynamic>(fetchWith: UseFetchReturn<T>): task<nil<T>> {
  const { data, execute, error } = fetchWith
  await execute()
  if (error.value)
    throw new Error(error.value)
  return data.value
}
