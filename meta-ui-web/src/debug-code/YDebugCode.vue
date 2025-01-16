<script lang="ts" setup>
import type {YDebugCodeProps} from './index'

const props = withDefaults(defineProps<YDebugCodeProps>(), {
  wrap: true,
  code: () => '',
  lang: 'json',
  title: null
})

const internalTypedCode = computed<string>(() => {
  if (props.lang === 'json') return JSON.stringify(props.code, null, 2)
  if (typeof props.code === 'string') return props.code
  return JSON.stringify(props.code)
})
</script>

<template>
  <VCard>
    <NSpace bgM p4>
      <NCode :language="lang" :code="internalTypedCode" :wordWrap="wrap" />
    </NSpace>
  </VCard>
</template>
