<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'vuetify/styles'
import 'element-plus/theme-chalk/dark/css-vars.css'

import {NConfigProvider} from 'naive-ui'
import {useTheme} from 'vuetify'

import {
  ElementPlusDayjs as dayjs,
  ElementPlusEn,
  ElementPlusZhCn,
  NaiveEnUs,
  NaiveZhCn,
  NaiveDarkTheme,
  NaiveLightTheme,
  NaiveDateEnUs,
  NaiveDateZhCN
} from '../common'

import type {Props} from './index'

const vuetifyUseTheme = useTheme()
const darkUse = useDark()

const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
  dark: true
})

const darkLight = computed(() => (props.dark ? 'dark' : 'light'))

watch(
  () => props.dark,
  v => {
    darkUse.value = v
    vuetifyUseTheme.global.name.value = darkLight.value
  }
)
watch(
  () => props.locale,
  v => {
    dayjs.locale((v ?? 'en').toLowerCase())
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
</script>

<template>
  <NConfigProvider ref="naiveThemeHandle" :theme="naiveDarkTheme" :locale="naiveLocale" :date-locale="naiveDateLocale">
    <NGlobalStyle />
    <ElConfigProvider :locale="elLocale">
      <VDefaultsProvider :defaults="{}">
        <VLocaleProvider :locale="props.locale">
          <VThemeProvider :theme="darkLight">
            <slot />
          </VThemeProvider>
        </VLocaleProvider>
      </VDefaultsProvider>
    </ElConfigProvider>
  </NConfigProvider>
</template>
