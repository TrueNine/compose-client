<script setup lang="ts">
import {useField} from 'vee-validate'
import type {YFieldMessageEmits, YFieldMessageProps} from './index'
import {maybeArray} from '@compose/api-model'

const props = defineProps<YFieldMessageProps>()
const emits = defineEmits<YFieldMessageEmits>()
const parentForm = inject(YFormInjectionKey)

const __propName = toRef(props.name)
const _manes = computed(() => {
  return maybeArray(__propName.value).filter(Boolean)
})
let fields: ReturnType<typeof useField>[] = []
watch(
  _manes,
  names => {
    fields = names.map(e => {
      return useField(e, void 0, {form: parentForm?.getForm(), syncVModel: false})
    })
  },
  {immediate: true}
)

function cleanMessage(messages?: string | (string | undefined)[]) {
  if (messages === void 0) {
    return []
  }
  if (typeof messages === 'string') {
    return []
  }
  if (messages.every(e => e === void 0)) {
    return []
  }
  return messages.filter(Boolean) as string[]
}

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

function setErrorHandler(messages?: string | (string | undefined)[]) {
  const cleanedMsg = cleanMessage(messages)
  fields.forEach(e => {
    e.setErrors(cleanedMsg)
  })
  return cleanedMsg
}

const _modelValue = computed<string[]>({
  get: () => fields.map(e => e.errorMessage.value).filter(Boolean) as string[],
  set: (v?: string | (string | undefined)[]) => {
    const msg = setErrorHandler(v)
    emits('change', msg)
    emits('update:modelValue', msg)
  }
})
const active = computed(() => !!(_modelValue.value.length && mounted.value))
</script>

<template>
  <slot name="default" :active="active" :message="_modelValue">
    <VMessages :active="active" :messages="_modelValue" color="error" />
  </slot>
</template>
