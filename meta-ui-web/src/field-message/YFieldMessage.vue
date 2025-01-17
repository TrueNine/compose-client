<script setup lang="ts">
import {useField, useSetFieldError} from 'vee-validate'
import type {YFieldMessageEmits, YFieldMessageProps} from './index'
import {maybeArray} from '@compose/api-model'

const props = defineProps<YFieldMessageProps>()
const emits = defineEmits<YFieldMessageEmits>()

const _name = toRef(props.name)
const active = computed(() => !!_name.value)
const parentForm = inject(YFormInjectionKey)
const fields = computed(() => {
  const names = maybeArray(_name.value)
  return names.map(name => {
    return {
      field: useField(name, void 0, {form: parentForm?.getForm(), syncVModel: false}),
      setError: useSetFieldError(name)
    }
  })
})

function setErrorHandler(messages?: string | string[]) {
  fields.value.forEach(e => { e.setError(messages); })
}

const setModelValueLock = ref(true)
const _modelValue = computed({
  get: () => fields.value.map(e => e.field.errors.value).reduce((acc, cur) => [...acc, ...cur], []),
  set: (v: string | string[] | undefined) => {
    setModelValueLock.value = true
    if (!v) {
      setErrorHandler(void 0)
      return
    }
    const messages = maybeArray(v)
    setErrorHandler(messages)
    emits('change', messages)
    emits('update:modelValue', messages)
    setModelValueLock.value = false
  }
})

watch(field.errors, v => {
  if (setModelValueLock.value) return
  if (!v) {
    _modelValue.value = void 0
    return
  }
  _modelValue.value = v
})
</script>

<template>
  <slot name="default" :active="active" :message="_modelValue">
    <VMessages :active="active" :messages="_modelValue" color="error" />
  </slot>
</template>
