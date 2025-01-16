<script setup lang="tsx">
import {useFieldError, useSetFieldError} from 'vee-validate'
import type {YFieldMessageEmits, YFieldMessageProps} from './index'
import {maybeArray} from '@compose/api-model'

const props = defineProps<YFieldMessageProps>()
const emits = defineEmits<YFieldMessageEmits>()

const _name = toRef(props.name)
const active = computed(() => !!_name.value)
const errors = useFieldError(_name)
const setErrorHandler = useSetFieldError(_name)
const _modelValue = computed<string[]>({
  get: () => [errors.value],
  set: (v: string | string[] | undefined) => {
    if (!v) return
    setErrorHandler(v)
    emits('change', maybeArray(v))
    emits('update:modelValue', maybeArray(v))
  }
})
watch(errors, v => {
  if (!v) return
  _modelValue.value = [v]
})
</script>

<template>
  <slot name="default" :active="active" :message="_modelValue">
    <VMessages :active="active" :messages="_modelValue" color="error" />
  </slot>
</template>
