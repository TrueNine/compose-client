import type {dynamic, nil, task} from '@compose/api-types'
import type {MaybeRefOrGetter} from '@vueuse/shared'

import type {EventHookOn, Fn} from '@/_vueuse.adaptor'

export interface UseReqReturn<T> {
  isFinished: Readonly<boolean>
  statusCode: nil<number>
  response: nil<Response>
  error: dynamic
  data: nil<T>
  isFetching: Readonly<boolean>
  canAbort: boolean
  aborted: boolean
  abort: Fn
  execute: (throwOnFailed?: boolean) => task<dynamic>

  onFetchResponse: EventHookOn<Response>
  onFetchError: EventHookOn
  onFetchFinally: EventHookOn

  // methods
  get: (payload?: object, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
  post: (payload?: unknown, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
  put: (payload?: unknown, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
  delete: (payload?: unknown, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
  patch: (payload?: unknown, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
  head: (payload?: unknown, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
  options: (payload?: unknown, type?: string) => UseReqReturn<T> & PromiseLike<UseReqReturn<T>>

  // type
  json: <JSON = unknown>() => UseReqReturn<JSON> & PromiseLike<UseReqReturn<JSON>>
  text: () => UseReqReturn<string> & PromiseLike<UseReqReturn<string>>
  blob: () => UseReqReturn<Blob> & PromiseLike<UseReqReturn<Blob>>
  arrayBuffer: () => UseReqReturn<ArrayBuffer> & PromiseLike<UseReqReturn<ArrayBuffer>>
  formData: () => UseReqReturn<FormData> & PromiseLike<UseReqReturn<FormData>>
}

export type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
export type Combination = 'overwrite' | 'chain'
export const payloadMapping: Record<string, string> = {
  json: 'application/json',
  text: 'text/plain'
}

export interface BeforeFetchContext {
  url: string
  options: RequestInit
  cancel: Fn
}
export interface AfterFetchContext<T = dynamic> {
  response: Response
  data: T | null
}
export interface OnFetchErrorContext<T = dynamic, E = dynamic> {
  error: E
  data: nil<T>
}
export interface UseReqOptions {
  fetch?: typeof window.fetch
  immediate?: boolean
  refetch?: MaybeRefOrGetter<boolean>
  initialData?: dynamic
  timeout?: number
  updateDataOnError?: boolean
  beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void
  afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>
  onFetchError?: (ctx: {data: dynamic; response: nil<Response>; error: dynamic}) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>
}
export interface CreateFetchOptions {
  baseUrl?: string
  combination?: Combination
  options?: UseReqOptions
  fetchOptions?: RequestInit
}
