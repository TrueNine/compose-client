/// <reference types="vite/client" />
import type {SafeAny} from '@compose/api-types'

declare module '*.vue' {
  import {ComponentOptions} from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare module 'element-plus/dist/locale/zh-cn' {
  const a: SafeAny
  export default a
}

declare module 'element-plus/dist/locale/en' {
  const a: SafeAny
  export default a
}
