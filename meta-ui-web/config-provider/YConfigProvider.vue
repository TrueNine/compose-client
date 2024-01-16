<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'element-plus/theme-chalk/dark/css-vars.css'

import {NConfigProvider} from 'naive-ui'
import type {dynamic} from '@compose/api-types'

import {
  ElementPlusDayjs as dayjs,
  ElementPlusEn,
  ElementPlusZhCn,
  hljs,
  NaiveDarkTheme,
  NaiveDateEnUs,
  NaiveDateZhCN,
  NaiveEnUs,
  NaiveLightTheme,
  NaiveZhCn,
  QuasarEnUs,
  QuasarZhCn
} from '../common'
import {checkDark, checkLocale} from '../common/VarletCommon'

import type {YConfigProviderProps} from './index'

const vuetifyUseTheme = useTheme()

const darkUse = useDark()
const q = useQuasar()
const props = withDefaults(defineProps<YConfigProviderProps>(), {
  locale: 'zh-CN',
  dark: true
})
const darkLight = computed(() => (props.dark ? 'dark' : 'light'))
const quasarLocale = computed(() => {
  switch (props.locale) {
    case 'zh-CN':
      return QuasarZhCn
    default:
      return QuasarEnUs
  }
})

darkUse.value = props.dark
q.dark.set(props?.dark ?? true)
q.lang.set(quasarLocale.value)
checkDark(!(props.dark ?? false))
checkLocale(props.locale ?? 'zh-CN')

watch(
  () => props.dark,
  v => {
    darkUse.value = v
    q.dark.set(v)
    checkDark(!(props.dark ?? false))
    vuetifyUseTheme.global.name.value = darkLight.value
  }
)
watch(
  () => props.locale,
  v => {
    checkLocale(props.locale ?? 'zh-CN')
    dayjs.locale((v ?? 'en').toLowerCase())
    q.lang.set(quasarLocale.value)
  }
)

const naiveThemeHandle = ref(null)
const elLocale = computed(() => {
  switch (props.locale) {
    case 'zh-CN':
      return ElementPlusZhCn
    default:
      return ElementPlusEn
  }
})

const naiveDarkTheme = computed(() => (props.dark ? NaiveDarkTheme : NaiveLightTheme))
const naiveLocale = computed(() => {
  switch (props.locale) {
    case 'zh-CN':
      return NaiveZhCn
    default:
      return NaiveEnUs
  }
})

const naiveDateLocale = computed(() => {
  switch (props.locale) {
    case 'zh-CN':
      return NaiveDateZhCN
    default:
      return NaiveDateEnUs
  }
})
defineSlots<{
  default: () => dynamic
}>()
</script>

<template>
  <ElConfigProvider :locale="elLocale">
    <NConfigProvider ref="naiveThemeHandle" :hljs="hljs" :theme="naiveDarkTheme" :locale="naiveLocale" :date-locale="naiveDateLocale">
      <NGlobalStyle />
      <VDefaultsProvider :defaults="{}">
        <VLocaleProvider :locale="props.locale">
          <VThemeProvider :theme="darkLight">
            <slot name="default" />
          </VThemeProvider>
        </VLocaleProvider>
      </VDefaultsProvider>
    </NConfigProvider>
  </ElConfigProvider>
</template>
