<script setup lang="tsx">
import type {dynamic} from '@truenine/types'
import {maybeArray} from '@truenine/shared'
import {useField} from 'vee-validate'
import {computed, reactive, ref, toRef} from 'vue'

interface Props {
  component: dynamic
  label?: string
  placeholder?: string
  modelNames: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {label: void 0, placeholder: void 0})
const mounted = ref(false)
if (!mounted.value) mounted.value = true

const _modelNames = computed(() => {
  const len = Object.keys(props.modelNames).length
  if (len === 0) return {}
  return props.modelNames
})

const _allFields = reactive(
  Object.entries(_modelNames.value)
    .map(([modelValueName, bindModelValueName]) => useField(modelValueName, void 0, {label: bindModelValueName})),
)
const _allErrors = computed(() => _allFields.map(e => e.errorMessage).filter((e): e is string => Boolean(e)))

const effectVModels = computed(() => {
  if (!mounted.value) return {}

  // 首先收集所有基础属性
  const baseProps = {...props.component.props ?? {}, errorMessages: _allErrors.value, label: props.label, placeholder: props.placeholder}

  // 然后收集所有事件和值属性，但不覆盖它们
  const fieldProps: Record<string, any> = {}

  _allFields.forEach(f => {
    const label = toRef(f.label).value
    if (!label) throw new Error('label is required')

    // 添加值绑定
    fieldProps[label] = f.value

    // 添加事件监听
    fieldProps[`onUpdate:${label}`] = (v: dynamic) => f.setValue(v)
  })

  // 添加通用事件
  const commonEvents = {'onBlur': (e: Event) => _allFields[0]?.handleBlur(e, true), 'onReset': () => _allFields[0]?.handleReset, 'onUpdate:errorMessages': (v: string | string[]) => _allFields.forEach(f => f.setErrors(maybeArray(v)))}

  // 合并所有属性
  return {...baseProps, ...fieldProps, ...commonEvents}
})
</script>

<template>
<component v-bind="effectVModels" :is="props.component" />
</template>
