/// <reference types="vite/client" />
/// <reference types="vue/jsx" />
/// <reference types="vitest" />
/// <reference types="@vueuse/core" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue' { // Vue SFC 类型声明
  import type {DefineComponent} from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'element-plus/dist/locale/en.mjs' { // Element Plus 模块声明
  const locale: any
  export default locale
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any
  export default locale
}

declare global { // Vue 组合式 API 全局导入
  const computed: typeof import('vue')['computed'],
    ref: typeof import('vue')['ref'],
    reactive: typeof import('vue')['reactive'],
    watch: typeof import('vue')['watch'],
    watchEffect: typeof import('vue')['watchEffect'],
    provide: typeof import('vue')['provide'],
    inject: typeof import('vue')['inject'],
    nextTick: typeof import('vue')['nextTick'],
    onMounted: typeof import('vue')['onMounted'],
    onUnmounted: typeof import('vue')['onUnmounted'],
    defineProps: typeof import('vue')['defineProps'],
    defineEmits: typeof import('vue')['defineEmits'],
    defineExpose: typeof import('vue')['defineExpose'],
    withDefaults: typeof import('vue')['withDefaults'],

    useVModel: typeof import('@vueuse/core')['useVModel'], // VueUse 函数
    useRouter: typeof import('vue-router')['useRouter'],
    useRoute: typeof import('vue-router')['useRoute']
}
