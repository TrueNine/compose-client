<script setup lang="ts">
import type {Emits, Props} from './index'

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  range: false,
  mini: false
})
const emits = defineEmits<Emits>()

const _title = computed(() => {
  if (!props.title) {
    if (props.range) return '请选择日期范围'
    else return '请选择日期'
  } else return props.title
})
const _subtitle = computed(() => {
  if (!props.subtitle) return '选择年份'
  else return props.subtitle
})

const r = ref()
watch(
  () => r.value,
  v => {
    if (v) {
      if (props.range) {
        emits('update:rangeValue', [Number(v.from), Number(v.to)])
        emits('update:rangeStartValue', Number(v.from))
        emits('update:rangeEndValue', Number(v.to))
      } else emits('update:value', Number(v))
    }
  }
)
</script>

<template>
  <QDate v-bind="$attrs" v-model="r" :square="true" :flat="true" :title="_title" :subtitle="_subtitle" :range="range" :minimal="mini" mask="x" />
</template>
