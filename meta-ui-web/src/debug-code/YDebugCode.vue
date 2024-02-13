<script lang="ts" setup>
import type {YDebugCodeProps} from './index'

const props = withDefaults(defineProps<YDebugCodeProps>(), {
  wrap: true,
  code: () => '',
  lang: 'json',
  title: null
})

const internalTypedCode = computed<string>(() => {
  if (props.lang === `json` && typeof props.code !== `string`) return JSON.stringify(props.code, null, 2)
  else return props.code?.toString() ?? ''
})
</script>

<template>
  <VCard>
    <NSpace bg-m p-4>
      <NCode :language="lang" :code="internalTypedCode" :word-wrap="wrap" />
    </NSpace>
  </VCard>
</template>
