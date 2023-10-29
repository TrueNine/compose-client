/// <reference types="vite/client" />
import type {SafeAny} from '@compose/compose-types'
declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  import {SafeAny} from '@compose/compose-types'
  const component: DefineComponent<object, object, SafeAny>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn' {
  const a: SafeAny
  export default a
}

declare module 'element-plus/dist/locale/en' {
  const a: SafeAny
  export default a
}
