import {containsProp} from '@vueuse/shared'
import type {late} from '@compose/api-types'

import type {UseReqOptions} from '@/req/define'

export function isFetchOptions(obj: object): obj is UseReqOptions {
  return obj && containsProp(obj, 'immediate', 'refetch', 'initialData', 'timeout', 'beforeFetch', 'afterFetch', 'onFetchError', 'fetch', 'updateDataOnError')
}
export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}
export function headersToObject(headers: late<HeadersInit>) {
  if (typeof Headers !== 'undefined' && headers instanceof Headers) return Object.fromEntries(headers.entries())
  return headers
}
export function joinPaths(start: string, end: string): string {
  if (!start.endsWith('/') && !end.startsWith('/')) return `${start}/${end}`
  return `${start}${end}`
}
