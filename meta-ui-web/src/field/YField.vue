<script setup lang="ts">
import {useField} from 'vee-validate'
import type {dynamic} from '@compose/api-types'

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
const primaryField = useField(() => props.name, props.schema, {syncVModel: props.syncVModel})

type Err = typeof primaryField.errors.value

const primaryWarning = computed<string | undefined>(() => {
  return primaryField.errors.value
    .map(e => {
      if (typeof e !== 'string') {
        return (e as dynamic).msg
      }
    })
    .filter(Boolean)[0]
})

const primaryErrors = computed(() => {
  return primaryField.errors.value
    ?.map(e => {
      if (typeof e === 'string') {
        return e
      }
    })
    .filter(Boolean)
})

interface SlotProps extends Record<string, dynamic> {
  modelValue?: dynamic
  value?: dynamic
  'onUpdate:modelValue'?: (v?: dynamic) => void
  'onUpdate:value'?: (v?: dynamic) => void
  'onUpdate:errorMessages'?: (v?: Err) => void
  errorMessages?: Err
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

const onUpdateErrorMessages = (v?: Err) => {
  primaryField.setErrors(v! as unknown as Err)
}
defineSlots<{
  input: (e: dynamic) => dynamic
}>()

const slots = useSlots()
const schemaFn = ref<() => dynamic>()
onMounted(() => {
  const inp = slots.input
  if (inp) {
    const r = inp()
    if (r) {
      const first = r.slice(0, 1)[0]
      if (first) {
        const sf = (first as dynamic).defaultValidateSchema
        if (sf && typeof sf === 'function') schemaFn.value = sf
      }
    }
  }
})
const parentForm = inject(YFormInjectionKey, void 0)

onUpdated(() => {
  if (schemaFn.value) {
    const r = schemaFn.value()
    if (r && parentForm) parentForm.setFieldValidate(props.name, r)
  }
})
</script>

<template>
  <slot
    name="input"
    v-bind="otherModelProps"
    :hint="primaryWarning"
    :persistent-hint="true"
    :error-messages="primaryErrors"
    :[`${_modelName}`]="primaryField.value.value"
    :[`onUpdate:errorMessages`]="onUpdateErrorMessages"
    :[`onUpdate:${_modelName}`]="setPrimaryFieldValueFn"
  />
</template>
