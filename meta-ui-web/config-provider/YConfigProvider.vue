<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import {zhCn as elementZhCn, enUs as elementEnUs} from '../common/ElementPlusCommon'

import {dayjs} from 'element-plus'
import {darkTheme, dateEnUS as naiveDateEnUs, dateZhCN as naiveDateZhCn, enUS as naiveEnUs, lightTheme, NConfigProvider, zhCN as naiveZhCn} from 'naive-ui'
import 'element-plus/theme-chalk/dark/css-vars.css'

import type {Props} from './index'

const darkUse = useDark()

const props = withDefaults(defineProps<Props>(), {
  locale: 'en-us',
  dark: true
})

dayjs.locale((props.locale ?? 'en').toLowerCase())
const naiveThemeHandle = ref(null)
const elLocale = computed(() => {
  switch (props.locale) {
    case 'zh-cn':
      return elementZhCn
    default:
      return elementEnUs
  }
})

watch(
  () => props.dark,
  v => {
    darkUse.value = v
  }
)
const naiveDarkTheme = computed(() => {
  return props.dark ? darkTheme : lightTheme
})

const naiveLocale = computed(() => {
  switch (props.locale) {
    case 'zh-cn':
      return naiveZhCn
    default:
      return naiveEnUs
  }
})

const naiveDateLocale = computed(() => {
  switch (props.locale) {
    case 'zh-cn':
      return naiveDateZhCn
    default:
      return naiveDateEnUs
  }
})
</script>

<template>
  <NConfigProvider ref="naiveThemeHandle" :theme="naiveDarkTheme" :locale="naiveLocale" :date-locale="naiveDateLocale">
    <NGlobalStyle />
    <ElConfigProvider :locale="elLocale">
      <slot />
    </ElConfigProvider>
  </NConfigProvider>
</template>
