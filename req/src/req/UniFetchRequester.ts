import type {dynamic, nil} from '@compose/api-types'
import {createEventHook, type Stoppable, useTimeoutFn} from '@vueuse/shared'
import {until} from '@vueuse/core'

import type {UseReqOptions, UseReqReturn, CreateFetchOptions, Combination, HttpMethod, DataType, BeforeFetchContext} from './define'
import {payloadMapping} from './define'
import {headersToObject, isAbsoluteURL, isFetchOptions, joinPaths} from './UseFetchAdaptor'

import {defaultWindow} from '@/_vueuse.adaptor'
import {queryParam} from '@/form'

function combineCallbacks<T = dynamic>(combination: Combination, ...callbacks: (((ctx: T) => void | Partial<T> | Promise<void | Partial<T>>) | undefined)[]) {
  if (combination === 'overwrite') {
    return async (ctx: T) => {
      const callback = callbacks[callbacks.length - 1]
      if (callback) return {...ctx, ...(await callback(ctx))}
      return ctx
    }
  } else {
    return async (ctx: T) => {
      for (const callback of callbacks) {
        if (callback) ctx = {...ctx, ...(await callback(ctx))}
      }
      return ctx
    }
  }
}

export function createReq(config: CreateFetchOptions = {}) {
  const _combination = config.combination || ('chain' as Combination)
  const _options = config.options || {}
  const _fetchOptions = config.fetchOptions || {}

  function useFactoryFetch(targetUrl: string, ...args: dynamic[]) {
    const computedUrl = config.baseUrl && !isAbsoluteURL(targetUrl) ? joinPaths(config.baseUrl, targetUrl) : targetUrl
    let options = _options
    let fetchOptions = _fetchOptions
    if (args.length > 0) {
      if (isFetchOptions(args[0])) {
        options = {
          ...options,
          ...args[0],
          beforeFetch: combineCallbacks(_combination, _options.beforeFetch, args[0].beforeFetch),
          afterFetch: combineCallbacks(_combination, _options.afterFetch, args[0].afterFetch),
          onFetchError: combineCallbacks(_combination, _options.onFetchError, args[0].onFetchError)
        }
      } else {
        fetchOptions = {
          ...fetchOptions,
          ...args[0],
          headers: {
            ...(headersToObject(fetchOptions.headers) || {}),
            ...(headersToObject(args[0].headers) || {})
          }
        }
      }
    }

    if (args.length > 1 && isFetchOptions(args[1])) {
      options = {
        ...options,
        ...args[1],
        beforeFetch: combineCallbacks(_combination, _options.beforeFetch, args[1].beforeFetch),
        afterFetch: combineCallbacks(_combination, _options.afterFetch, args[1].afterFetch),
        onFetchError: combineCallbacks(_combination, _options.onFetchError, args[1].onFetchError)
      }
    }
    return useReq(computedUrl, fetchOptions, options)
  }
  return useFactoryFetch as typeof useReq
}

export function useReq<T>(url: string): UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
export function useReq<T>(url: string, useFetchOptions: UseReqOptions): UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
export function useReq<T>(url: string, options: RequestInit, useFetchOptions?: UseReqOptions): UseReqReturn<T> & PromiseLike<UseReqReturn<T>>
export function useReq<T>(url: string, ...args: dynamic[]): UseReqReturn<T> & PromiseLike<UseReqReturn<T>> {
  const supportsAbort = typeof AbortController === 'function'
  let fetchOptions: RequestInit = {}
  let options: UseReqOptions = {
    immediate: false,
    refetch: false,
    timeout: 0,
    updateDataOnError: false
  }

  interface InternalConfig {
    method: HttpMethod
    type: DataType
    payload: unknown
    payloadType?: string
  }

  const config: InternalConfig = {
    method: 'GET',
    type: 'text' satisfies DataType,
    payload: void 0 as unknown
  }

  if (args.length > 0) {
    if (isFetchOptions(args[0])) options = {...options, ...args[0]}
    else fetchOptions = args[0]
  }

  if (args.length > 1) {
    if (isFetchOptions(args[1])) options = {...options, ...args[1]}
  }

  const {fetch = defaultWindow?.fetch, initialData, timeout} = options

  const responseEvent = createEventHook<Response>()
  const errorEvent = createEventHook<dynamic>()
  const finallyEvent = createEventHook<dynamic>()

  let isFinished = false
  let isFetching = false
  let aborted = false
  let statusCode: nil<number> = null
  let response: nil<Response> = null
  let error: dynamic = null
  let data: nil<T> = null

  const canAbort = supportsAbort && isFetching

  let controller: AbortController | undefined
  let timer: Stoppable | undefined

  const abort = () => {
    if (supportsAbort) {
      controller?.abort()
      controller = new AbortController()
      controller.signal.onabort = () => (aborted = true)
      fetchOptions = {
        ...fetchOptions,
        signal: controller.signal
      }
    }
  }

  const loading = (isLoading: boolean) => {
    isFetching = isLoading
    isFinished = !isLoading
  }

  if (timeout) timer = useTimeoutFn(abort, timeout, {immediate: false})
  let executeCounter = 0

  const execute = async (throwOnFailed = false) => {
    abort()
    loading(true)
    error = null
    statusCode = null
    aborted = false
    executeCounter += 1
    const currentExecuteCounter = executeCounter
    const defaultFetchOptions: RequestInit = {
      method: config.method,
      headers: {}
    }
    if (config.payload) {
      const headers = headersToObject(defaultFetchOptions.headers) as Record<string, string>
      const payload = config.payload
      if (!config.payloadType && payload && Object.getPrototypeOf(payload) === Object.prototype && !(payload instanceof FormData)) config.payloadType = 'json'
      if (config.payloadType) headers['Content-Type'] = payloadMapping[config.payloadType] ?? config.payloadType
      defaultFetchOptions.body = config.payloadType === 'json' ? JSON.stringify(payload) : (payload as BodyInit)
    }
    let isCanceled = false

    const context: BeforeFetchContext = {
      url,
      options: {
        ...defaultFetchOptions,
        ...fetchOptions
      },
      cancel: () => {
        isCanceled = true
      }
    }
    if (options.beforeFetch) Object.assign(context, await options.beforeFetch(context))
    if (isCanceled || !fetch) {
      loading(false)
      return Promise.resolve(null)
    }

    let responseData: dynamic = null
    if (timer) timer.start()

    return fetch(context.url, {
      ...defaultFetchOptions,
      ...context.options,
      headers: {
        ...headersToObject(defaultFetchOptions.headers),
        ...headersToObject(context.options?.headers)
      }
    })
      .then(async fetchResponse => {
        response = fetchResponse
        statusCode = fetchResponse.status
        responseData = await fetchResponse.clone()[config.type]()

        if (!fetchResponse.ok) {
          data = initialData || null
          throw new Error(fetchResponse.statusText)
        }
        if (options.afterFetch) {
          ;({data: responseData} = await options.afterFetch({
            data: responseData,
            response: fetchResponse
          }))
        }
        data = responseData
        responseEvent.trigger(fetchResponse)
        return fetchResponse
      })
      .catch(async fetchError => {
        let errorData = fetchError.message || fetchError.name
        if (options.onFetchError) {
          ;({error: errorData, data: responseData} = await options.onFetchError({
            data: responseData,
            error: fetchError,
            response: response
          }))
        }

        error = errorData
        if (options.updateDataOnError) data = responseData
        errorEvent.trigger(fetchError)

        if (throwOnFailed) throw fetchError
        return null
      })
      .finally(() => {
        if (currentExecuteCounter === executeCounter) loading(false)
        if (timer) timer.stop()
        finallyEvent.trigger(null)
      })
  }

  // const refetch = options.refetch

  const shell: UseReqReturn<T> = {
    isFinished: isFinished,
    isFetching: isFetching,
    statusCode,
    response,
    error,
    data,
    canAbort,
    aborted,

    abort,
    execute,

    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
    onFetchFinally: finallyEvent.on,
    // method
    get: setMethod('GET'),
    put: setMethod('PUT'),
    post: setMethod('POST'),
    delete: setMethod('DELETE'),
    patch: setMethod('PATCH'),
    head: setMethod('HEAD'),
    options: setMethod('OPTIONS'),
    // type
    json: setType('json'),
    text: setType('text'),
    blob: setType('blob'),
    arrayBuffer: setType('arrayBuffer'),
    formData: setType('formData')
  }

  function setMethod(method: HttpMethod) {
    return (payload?: unknown, payloadType?: string) => {
      if (!isFetching) {
        config.method = method
        if (config.method === 'GET') {
          config.payload = void 0
          config.payloadType = void 0
          url = joinPaths(url, queryParam(payload as object))
        } else {
          config.payload = payload
          config.payloadType = payloadType
        }

        return {
          ...shell,
          then(onFulfilled: dynamic, onRejected: dynamic) {
            return waitUntilFinished().then(onFulfilled, onRejected)
          }
        } as dynamic
      }
      return void 0
    }
  }

  function waitUntilFinished() {
    return new Promise<UseReqReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(shell))
        .catch((error: unknown) => reject(error))
    })
  }
  function setType(type: DataType) {
    return () => {
      if (!isFetching) {
        config.type = type
        return {
          ...shell,
          then(onFulfilled: dynamic, onRejected: dynamic) {
            return waitUntilFinished().then(onFulfilled, onRejected)
          }
        } as dynamic
      }
      return void 0
    }
  }
  if (options.immediate) Promise.resolve().then(() => execute())

  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilFinished().then(onFulfilled, onRejected)
    }
  }
}
