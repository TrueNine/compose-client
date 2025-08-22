/// <reference types="vite/client" />
/// <reference types="vue/jsx" />
/// <reference types="vitest" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
