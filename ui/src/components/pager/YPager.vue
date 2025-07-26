<script setup lang="ts">
import type { YPagerEmits, YPagerProps } from './index'

import { Pw } from '@truenine/shared'

const props = withDefaults(defineProps<YPagerProps>(), {
  modelValue: () => Pw.DEFAULT_MAX,
  pr: null,
  maxPage: 6,
  total: 10,
})

const emits = defineEmits<YPagerEmits>()

const _modelValue = useVModel(props, 'modelValue', emits, { passive: true })
watch(_modelValue, (v) => {
  emits('change', v)
})

const maxPage = computed(() => props.pr?.p ?? 1)
const modelOffset = computed({
  get: () => 1 + (_modelValue.value.o ?? 0),
  set: (v) => {
    _modelValue.value = { ...props.modelValue, o: v - 1 }
  },
})
</script>

<template>
<VPagination v-bind="$attrs" v-model="modelOffset" :totalVisible="props.total" :maxPages="maxPage" :length="maxPage" />
</template>
