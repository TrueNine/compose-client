/// <reference types="vite/client" />

declare module "*.vue" {
  import {ComponentOptions} from "vue"
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare module 'element-plus/dist/locale/zh-cn' {
  const a:any
  export default a
}

declare module 'element-plus/dist/locale/en' {
  const a:any
  export default a
}
