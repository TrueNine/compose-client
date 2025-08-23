/// <reference types="vite/client" />
/// <reference types="vue/jsx" />
/// <reference types="vitest" />
/// <reference types="@vueuse/core" />
/// <reference types="unplugin-vue-router/client" />

// Vue SFC 类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

// Element Plus 模块声明
declare module 'element-plus/dist/locale/en.mjs' {
  const locale: any
  export default locale
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any
  export default locale
}

// Vue 组合式 API 全局导入
declare global {
  const computed: typeof import('vue')['computed']
  const ref: typeof import('vue')['ref']
  const reactive: typeof import('vue')['reactive']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const provide: typeof import('vue')['provide']
  const inject: typeof import('vue')['inject']
  const nextTick: typeof import('vue')['nextTick']
  const onMounted: typeof import('vue')['onMounted']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const defineProps: typeof import('vue')['defineProps']
  const defineEmits: typeof import('vue')['defineEmits']
  const defineExpose: typeof import('vue')['defineExpose']
  const withDefaults: typeof import('vue')['withDefaults']

  // VueUse 函数
  const useVModel: typeof import('@vueuse/core')['useVModel']
  const useRouter: typeof import('vue-router')['useRouter']
  const useRoute: typeof import('vue-router')['useRoute']
}
