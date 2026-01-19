<script setup lang="ts">
import type {YConfigProviderProps} from './index'

import {useDark} from '@vueuse/core'

import {computed, watch} from 'vue'
import {useTheme} from 'vuetify'

import {ElementPlusDayjs as dayjs, ElementPlusEn, ElementPlusZhCn} from '@/common'
import {checkDark, checkLocale} from '@/common/VarletCommon'
import 'dayjs/locale/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css'

const props = withDefaults(defineProps<YConfigProviderProps>(), {locale: 'zh-CN', dark: true, elementPlusZIndex: 1})

defineSlots()

const vuetifyUseTheme = useTheme()
const darkUse = useDark()
const darkLight = computed(() => (props.dark ? 'dark' : 'light'))

darkUse.value = props.dark

checkDark(!props.dark)
checkLocale(props.locale)

watch(
  () => props.dark,
  v => {
    darkUse.value = v
    checkDark(!props.dark)
    vuetifyUseTheme.global.name.value = darkLight.value
  }
)
watch(
  () => props.locale,
  v => {
    checkLocale(props.locale)
    dayjs.locale(v.toLowerCase())
  }
)

const elLocale = computed(() => {
  switch (props.locale) {
    case 'zh-CN': return ElementPlusZhCn
    default: return ElementPlusEn
  }
})
</script>

<template>
<ElConfigProvider :zIndex="1" :locale="elLocale">
  <VThemeProvider :theme="darkLight">
    <slot name="default" />
  </VThemeProvider>
</ElConfigProvider>
</template>
