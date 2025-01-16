<script setup lang="tsx">
import {useField, useSetFieldError} from 'vee-validate'
import type {YFieldMessageEmits, YFieldMessageProps} from './index'
import {maybeArray} from '@compose/api-model'

const props = defineProps<YFieldMessageProps>()
const emits = defineEmits<YFieldMessageEmits>()

const _name = toRef(props.name)
const active = computed(() => !!_name.value)
const parentForm = inject(YFormInjectionKey)
const field = useField(_name, void 0, {form: parentForm?.getForm()})
const setErrorHandler = useSetFieldError(_name)

const setModelValueLock = ref(true)
const _modelValue = computed<string[]>({
  get: () => field.errors.value,
  set: (v: string | string[] | undefined) => {
    setModelValueLock.value = true
    if (!v) {
      setErrorHandler(void 0)
      return
    }
    setErrorHandler(v)
    emits('change', maybeArray(v))
    emits('update:modelValue', maybeArray(v))
    setModelValueLock.value = false
  }
})

watch(field.errors, v => {
  if (setModelValueLock.value) return
  if (!v) {
    _modelValue.value = []
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
