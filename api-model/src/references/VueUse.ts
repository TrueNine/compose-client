import type {UseFetchReturn} from '@vueuse/core'
import type {dynamic, nil, task} from '@compose/api-types'

/**
 * ## 将 vueuse 的请求，进行一次立即请求
 *
 * @param fetchWith fetch 调用方法
 * @returns 进行的直接请求
 */
export async function eagerFetch<T = dynamic>(fetchWith: UseFetchReturn<T>): task<nil<T>> {
  const {data, execute, error} = fetchWith
  await execute()
  if (error.value) return await Promise.reject(error.value)
  return data.value
}