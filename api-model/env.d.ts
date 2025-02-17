/// <reference types="vite/client" />
import type {SafeAny} from '@compose/api-types'
import type {dynamic} from '@compose/api-types/src'

declare module '*.vue' {
  import {ComponentOptions} from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare module 'element-plus/dist/locale/zh-cn' {
  const a: dynamic
  export default a
}

declare module 'element-plus/dist/locale/en' {
  const a: dynamic
  export default a
}
