/// <reference types="vite/client" />
/// <reference types="vue/jsx" />
/// <reference types="vitest" />
/// <reference types="@vueuse/core" />

declare module '*.vue' { // Vue SFC 类型声明
  import type {DefineComponent} from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module 'element-plus/dist/locale/en.mjs' { // Element Plus 模块声明
  const locale: Record<string, unknown>
  export default locale
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: Record<string, unknown>
  export default locale
}

declare const computed: typeof import('vue')['computed']
declare const ref: typeof import('vue')['ref']
declare const reactive: typeof import('vue')['reactive']
declare const watch: typeof import('vue')['watch']
declare const watchEffect: typeof import('vue')['watchEffect']
declare const provide: typeof import('vue')['provide']
declare const inject: typeof import('vue')['inject']
declare const nextTick: typeof import('vue')['nextTick']
declare const onMounted: typeof import('vue')['onMounted']
declare const onUnmounted: typeof import('vue')['onUnmounted']
declare const defineProps: typeof import('vue')['defineProps']
declare const defineEmits: typeof import('vue')['defineEmits']
declare const defineExpose: typeof import('vue')['defineExpose']
declare const withDefaults: typeof import('vue')['withDefaults']
declare const useVModel: typeof import('@vueuse/core')['useVModel']
declare const useRouter: typeof import('vue-router')['useRouter']
declare const useRoute: typeof import('vue-router')['useRoute']
