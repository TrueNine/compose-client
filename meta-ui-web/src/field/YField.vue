<script setup lang="ts">
import {useField} from 'vee-validate'
import type {dynamic, late} from '@compose/api-types'
import type {Schema} from 'yup'

import type {YFieldEmits, YFieldProps} from '@/field'
import {YFormInjectionKey} from '@/form'

const props = withDefaults(defineProps<YFieldProps>(), {
  modelValue: void 0,
  schema: void 0,
  syncVModel: 'modelValue',
  modelName: 'modelValue',
  effectModels: () => ({})
})
const emits = defineEmits<YFieldEmits>()
const _effectModels = useVModel(props, 'effectModels', emits, {passive: true})
const _modelName = useVModel(props, 'modelName', emits, {passive: true})

const defaultRules = ref<late<Schema<dynamic, dynamic>>>(props.schema)
const primaryField = useField(() => props.name, defaultRules, {syncVModel: props.syncVModel})

type PrimaryErrorsValueType = typeof primaryField.errors.value

const primaryWarning = computed<string | undefined>(() => {
  return primaryField.errors.value
    .map(e => {
      if (typeof e !== 'string') return (e as dynamic).msg
    })
    .filter(Boolean)[0]
})

const primaryErrors = computed(() => {
  return primaryField.errors.value
    ?.map(e => {
      if (typeof e === 'string') return e
    })
    .filter(Boolean)
})

interface SlotProps extends Record<string, dynamic> {
  modelValue?: dynamic
  value?: dynamic
  'onUpdate:modelValue'?: (v?: dynamic) => void
  'onUpdate:value'?: (v?: dynamic) => void
  'onUpdate:errorMessages'?: (v?: PrimaryErrorsValueType) => void
  errorMessages?: PrimaryErrorsValueType
}

const setPrimaryFieldValueFn = (v?: dynamic) => {
  primaryField.value.value = v
}

// TODO 维护好此 prop 避免内存泄露
const otherModelProps: SlotProps = {
  ...Object.entries(_effectModels.value)
    .filter(Boolean)
    .filter(([k, v]) => Boolean(k) && Boolean(v))
    .reduce(
      (acc, [k, v]) => {
        const field = useField(() => v)
        acc[`onUpdate:${k}`] = (v: dynamic) => {
          field.value.value = v
        }
        acc[k] = field.value.value
        return acc
      },
      {} as Record<string, dynamic>
    )
}

const onUpdateErrorMessages = (v?: PrimaryErrorsValueType) => {
  primaryField.setErrors(v! as unknown as PrimaryErrorsValueType)
}
defineSlots<{
  input: (...e: dynamic) => dynamic
}>()

const slots = useSlots()
const schemaFn = ref<() => Schema<dynamic, dynamic>>()
onMounted(() => {
  const input1SlotsFn = slots.input
  if (input1SlotsFn) {
    const r = input1SlotsFn()
    if (r) {
      const first = r
        .filter((e: dynamic) => {
          const typ = e.type as dynamic
          return typ && typ.props && typ.props.defaultValidateSchema && typ.props.defaultValidateSchema.default
        })
        .map((e: dynamic) => (e.type as dynamic).props.defaultValidateSchema.default)
        .slice(0, 1)[0]
      if (first) {
        if (first && typeof first === 'function') schemaFn.value = first
      }
    }
  }
})

const parentForm = inject(YFormInjectionKey, void 0)
onMounted(() => {
  if (schemaFn.value) {
    const r = schemaFn.value()
    if (r) {
      if (parentForm) parentForm.setFieldValidate(props.name, r)
      else defaultRules.value = r
    }
  }
})
</script>

<template>
  <slot
    name="input"
    v-bind="otherModelProps"
    :hint="primaryWarning"
    :persistentHint="true"
    :errorMessages="primaryErrors"
    :[`${_modelName}`]="primaryField.value.value"
    :[`onUpdate:errorMessages`]="onUpdateErrorMessages"
    :[`onUpdate:${_modelName}`]="setPrimaryFieldValueFn"
  />
</template>
