<script setup lang="tsx">
import type { dynamic } from '@compose/types'
import { maybeArray } from '@compose/shared'
import { useField } from 'vee-validate'
import { mergeProps } from 'vue'

interface Props {
  component: dynamic
  label?: string
  placeholder?: string
  modelNames: Record<string, string>
}

const props = withDefaults(
  defineProps<Props>(),
  {
    label: void 0,
    placeholder: void 0,
  },
)
const mounted = ref(false)
if (!mounted.value) {
  mounted.value = true
}

const _modelNames = computed(() => {
  const len = Object.keys(props.modelNames).length
  if (len === 0) {
    return {}
  }
  if (len === 1) {
    return { [Object.keys(props.modelNames)[0]]: 'modelValue' }
  }
  return props.modelNames
})

const _allFields = reactive(
  Object.entries(_modelNames.value)
    .map(([modelValueName, bindModelValueName]) => {
      return useField(modelValueName, void 0, { label: bindModelValueName })
    }),
)
const _allErrors = computed(() => {
  return _allFields.map((e) => e.errorMessage).filter((e): e is string => Boolean(e))
})

const effectVModels = computed(() => {
  if (!mounted.value) {
    return {}
  }
  return _allFields.map((f) => {
    const label = toRef(f.label).value
    if (!label) {
      throw new Error('label is required')
    }
    return mergeProps(
      props.component.props ?? {},
      {
        'onBlur': (e: Event) => f.handleBlur(e, true),
        'onReset': () => f.handleReset,
        [`onUpdate:${label}`]: (v: dynamic) => {
          f.setValue(v)
        },
        'onUpdate:errorMessages': (v: string | string[]) => {
          f.setErrors(maybeArray(v))
        },
      },
      {
        [label]: f.value,
        errorMessages: _allErrors.value,
        label: props.label,
        placeholder: props.placeholder,
      },
    )
  }).reduce((acc, cur) => {
    return { ...acc, ...cur }
  }, {})
})
</script>

<template>
<component v-bind="effectVModels" :is="props.component" />
</template>
