import {Headers} from '@compose/api-model'
import {createRequest} from '@compose/uni-mp-adk'

/**
 * # RBAC版 请求器
 */
export const useApi = createRequest({
  baseUrl: GlobalBase.url
})

export const useGetTokenApi = createRequest({
  baseUrl: GlobalBase.url,
  options: {
    afterRequest(ctx) {
      const metaData = ctx.data as object
      const r = {
        ...ctx,
        data: {
          ...metaData,
          authToken: ctx.response.headers[Headers.authorization] as string | null,
          reFlushToken: ctx.response.headers[Headers.xReFlushToken] as string | null
        }
      }
      return r
    }
  }
})
