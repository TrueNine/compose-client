<script setup lang="ts">
import {Pw} from '@compose/api-model'

import type {YPagerEmits, YPagerProps} from './index'

const props = withDefaults(defineProps<YPagerProps>(), {
  modelValue: () => Pw.DEFAULT_MAX,
  pr: null,
  maxPage: 6,
  total: 10
})

const emits = defineEmits<YPagerEmits>()

const modelPage = useVModel(props, 'modelValue', emits, {passive: true})

const modelOffset = computed({
  get: () => 1 + (modelPage.value.o ?? 0),
  set: v => {
    modelPage.value = {...props.modelValue, o: v - 1}
  }
})
const maxPage = computed(() => props.pr?.p ?? 1)
</script>

<template>
  <VPagination v-bind="$attrs" v-model="modelOffset" :total-visible="props.total" :max-pages="maxPage" :length="maxPage" />
</template>
