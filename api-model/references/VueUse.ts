import type {UseFetchReturn} from '@vueuse/core'
import type {Nil} from '@compose/compose-types/typescripts'
import type {SafeAny} from '@compose/compose-types'

/**
 * ## 将 vueuse 的请求，进行一次立即请求
 *
 * @param fetchWith fetch 调用方法
 * @returns 进行的直接请求
 */
export async function eagerFetch<T = SafeAny>(fetchWith: UseFetchReturn<T>): Promise<Nil<T>> {
  const {data, execute, error} = fetchWith
  await execute()
  if (error.value) return await Promise.reject(error.value)
  return data.value
}
