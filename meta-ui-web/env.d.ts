/// <reference types="vite/client" />

import type {dynamic} from '@compose/api-types'

declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  import {SafeAny} from '@compose/api-types'
  const component: DefineComponent<object, object, SafeAny>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn' {
  const a: SafeAny
  export default a
}

declare module 'element-plus/dist/locale/en' {
  const a: dynamic
  export default a
}
