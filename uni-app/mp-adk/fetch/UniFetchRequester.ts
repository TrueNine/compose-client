import {type Ref, ref, shallowRef} from 'vue'
import {Headers as ComposeHeader, MediaTypes} from '@compose/compose-types'

export type Headers = {
  [k in string]: string | number
}
export type RequestMethods = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT'

export interface RequestInit {
  headers?: Headers
}

export interface RequestDataOptions extends RequestInit {
  body?: unknown
  method?: RequestMethods
}

export interface UseRequestReturn<T> {
  error: Ref<Error | null>
  data: Ref<T | null>
  statusCode: Ref<number | null>
  isRequesting: Ref<boolean>

  execute: (throwOrFailed?: boolean) => Promise<T>

  text(): UseRequestReturn<string> & PromiseLike<UseRequestReturn<string>>

  json<JSON = unknown>(): UseRequestReturn<JSON> & PromiseLike<UseRequestReturn<JSON>>

  formData(): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>>

  get(): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>>

  post(payload?: unknown, type?: string): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>>

  put(payload?: unknown, type?: string): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>>

  delete(payload?: unknown, type?: string): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>>
}

export interface ResponseInit {
  readonly headers: Headers
  readonly ok: boolean
  readonly status: number
  readonly url: string
}

export type Combination = 'overwrite' | 'chain'

export interface CreateRequestOptions {
  /**
   * Determine the inherit behavior for beforeFetch, afterFetch, onFetchError
   * @default 'chain'
   */
  combination?: Combination
  baseUrl?: string
  options?: UseRequestOptions<unknown>
  requestOptions?: RequestInit
}

export interface BeforeRequestContext {
  url?: string
  options: RequestInit
}

export interface AfterRequestContext<T> {
  response: ResponseInit
  data: T | null
}

export interface UseRequestOptions<T = unknown> {
  /**
   * 是否立即执行
   *
   * @default true
   */
  immediate?: boolean

  /**
   * 在请求前的初始数据
   *
   * @default null
   */
  initialData?: T
  timeout?: number

  beforeRequest?: (ctx: BeforeRequestContext) => Promise<Partial<BeforeRequestContext> | void> | Partial<BeforeRequestContext> | void
  afterRequest?: (ctx: AfterRequestContext<T>) => Promise<Partial<AfterRequestContext<T>>> | Partial<AfterRequestContext<T>>
  onRequestError?: (ctx: {data: T | null; error: Error}) => Promise<Partial<{data: T | null; error: Error}>> | Partial<{data: T | null; error: Error}>
}

export function combinationCallback<T = unknown>(
  combination: Combination,
  ...callbacks: (((ctx: T) => void | Partial<T> | Promise<void | Partial<T>>) | undefined)[]
) {
  if (combination === 'overwrite') {
    return async (ctx: T) => {
      const callback = callbacks[callbacks.length - 1]
      if (callback) return {...ctx, ...(await callback(ctx))}
      return ctx
    }
  } else {
    // chaining and combine result
    return async (ctx: T) => {
      for (const callback of callbacks) {
        if (callback) ctx = {...ctx, ...(await callback(ctx))}
      }
      return ctx
    }
  }
}

export function hasJson<T>(headers: Headers, data: T): T {
  const typ = headers[ComposeHeader.contentType]
  const minTyp = headers[ComposeHeader.contentType.toLowerCase()]
  const j = typ || minTyp
  if (j) {
    const has = j === MediaTypes.json
    if (typeof data === 'string' && has) return JSON.parse(data)
    else return data
  } else return data
}

/**
 * ## 类 vueuse 设计的一个请求器
 *
 * 对 uniapp 的 uni.request 进行封装，使其更现代化
 * @returns
 */
export function createRequest(options?: CreateRequestOptions): typeof useRequest {
  const _proxyOptions = options
  const _combination = options?.combination || ('chain' as Combination)

  function proxyRequest<T = unknown>(
    url?: string,
    requestOptions?: RequestDataOptions,
    options?: UseRequestOptions<T>
  ): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>> {
    const __unknownTypingProxyOptions = _proxyOptions?.options as unknown as UseRequestOptions<T> | undefined
    return useRequest(
      (_proxyOptions?.baseUrl ?? '') + (url ?? ''),
      {..._proxyOptions?.options, ...requestOptions},
      {
        ..._proxyOptions?.requestOptions,
        ...options,
        beforeRequest: combinationCallback(_combination, __unknownTypingProxyOptions?.beforeRequest, options?.beforeRequest),
        afterRequest: combinationCallback(_combination, __unknownTypingProxyOptions?.afterRequest, options?.afterRequest),
        onRequestError: combinationCallback(_combination, __unknownTypingProxyOptions?.onRequestError, options?.onRequestError)
      }
    )
  }

  return proxyRequest
}

export function useRequest<T = unknown>(
  url?: string,
  options?: RequestDataOptions,
  requestOptions?: UseRequestOptions<T>
): UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>> {
  const config = {
    url: url,
    method: options?.method ?? ('GET' as RequestMethods),
    body: options?.body,
    type: 'application/json',
    headers: options?.headers,
    timeout: requestOptions?.timeout ?? 3000,
    initialData: requestOptions?.initialData ?? null,
    immediate: requestOptions?.immediate && true
  }

  const isRequesting = ref(false)
  const statusCode = ref<number | null>(null)
  const error = shallowRef<Error | null>(null)
  const data = shallowRef<T | null>(null)

  const execute = async (throwOnFailed = true) => {
    data.value = null
    error.value = null
    statusCode.value = null

    if (requestOptions?.beforeRequest) {
      // TODO 处理前置拦截器
      await requestOptions.beforeRequest({
        url: config.url,
        options: {
          headers: config.headers
        }
      })
    }

    const loading = (isLoading: boolean) => (isRequesting.value = isLoading)

    // 包装 uni app
    return new Promise<T>((res, rej) => {
      loading(true)
      try {
        uni.request({
          url: config.url ?? '',
          method: config.method ?? 'GET',
          data: config.body as AnyObject,
          timeout: config.timeout,
          header: {
            ...config.headers,
            'Content-Type': config.type
          },
          dataType: config.type,
          enableCache: true,
          success: async uniAppResp => {
            let metaResult = uniAppResp.data as unknown as T
            metaResult = hasJson(uniAppResp.header, metaResult) // 将字符串转换为 json
            if (requestOptions?.afterRequest) {
              const __afterResultCtx = await requestOptions.afterRequest({
                response: {
                  headers: uniAppResp.header,
                  ok: uniAppResp.statusCode === 200,
                  status: uniAppResp.statusCode,
                  url: url ?? ''
                },
                data: metaResult
              })

              if (__afterResultCtx.response) {
                if (__afterResultCtx.response.ok) {
                  data.value = __afterResultCtx.data as T
                  statusCode.value = __afterResultCtx.response.status
                  res(data.value)
                } else {
                  data.value = config.initialData || null
                  const newErr = new Error(uniAppResp.errMsg, {cause: uniAppResp})
                  error.value = {
                    ...newErr,
                    ...uniAppResp,
                    message: newErr.message,
                    name: 'UniAppRequestSuccessError'
                  }
                  // 判断其抛出异常
                  if (throwOnFailed) throw error.value
                  else rej(error.value)
                }
              }
            }
          },
          // TODO 此函数的返回值存疑
          fail: async uniAppError => {
            const newErr = new Error(uniAppError.errMsg, {cause: uniAppError})
            error.value = {
              ...newErr,
              ...uniAppError,
              message: newErr.message,
              name: 'UniAppRequestError'
            }
            if (throwOnFailed) throw error.value
            else rej(error.value)
          },
          complete: () => {
            loading(false)
          }
        })
      } catch (e) {
        // 强行尝试捕获 uni app 的错误
        const castException = e as Partial<Error>
        rej(castException)
        loading(false)
      }
    })
  }

  const shell: UseRequestReturn<T> = {
    error,
    data,
    statusCode,
    isRequesting,
    execute,

    get: setMethod('GET'),
    post: setMethod('POST'),
    put: setMethod('PUT'),
    delete: setMethod('DELETE'),

    text: setType('text'),
    json: setType('application/json'),
    formData: setType('application/x-www-form-urlencoded')
  }

  function setMethod(method: RequestMethods): (payload?: T, payloadType?: string) => UseRequestReturn<T> & PromiseLike<UseRequestReturn<T>> {
    return (payload?: T, type?: string) => {
      config.method = method
      config.body = payload
      config.type = type ?? 'application/json'
      return {
        ...shell,
        then(a, b) {
          return new Promise<UseRequestReturn<T>>(() => shell).then(a, b)
        }
      }
    }
  }

  function setType<TYPE>(type?: string): () => UseRequestReturn<TYPE> & PromiseLike<UseRequestReturn<TYPE>> {
    return () => {
      config.type = type ?? 'application/json'
      return {
        ...(shell as unknown as UseRequestReturn<TYPE>),
        then(onFulfilled, onRejected) {
          return new Promise<UseRequestReturn<TYPE>>(() => shell as unknown as UseRequestReturn<TYPE>).then(onFulfilled, onRejected)
        }
      }
    }
  }

  if (config.immediate) Promise.resolve().then(() => execute())

  return {
    ...shell,
    then(a, b) {
      return new Promise<UseRequestReturn<T>>(() => shell).then(a, b)
    }
  }
}
