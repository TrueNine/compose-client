<script setup lang="ts">
import {useField} from 'vee-validate'
import type {dynamic, late} from '@compose/api-types'
import type {Schema} from 'yup'
import type {YFieldEmits, YFieldProps, YFieldSlots} from '@/field'
import {maybeArray} from '@compose/api-model'

import {YFormInjectionKey} from '@/form'
import {mergeProps} from 'vue'

const props = withDefaults(defineProps<YFieldProps>(), {
  label: void 0,
  placeholder: void 0,
  modelValue: void 0,
  schema: void 0,
  syncVModel: 'modelValue',
  modelName: 'modelValue',
  effectModels: () => ({})
})
const emits = defineEmits<YFieldEmits>()
const __effectModelsVModel = useVModel(props, 'effectModels', emits, {passive: true})

const _effectModels = computed(() => {
  const mo = __effectModelsVModel.value
  if (!mo) return {}
  const res = maybeArray(mo).map(e => {
    if (typeof e === 'string') return {[e]: e}
    else return e
  })

  return res.reduce<Record<string, string>>((acc, cur) => {
    return {...acc, ...cur}
  }, {})
})

const _modelName = useVModel(props, 'modelName', emits, {passive: true})

const defaultRules = ref<late<Schema>>(props.schema)
const parentForm = inject(YFormInjectionKey, void 0)
const primaryField = useField(() => props.name, defaultRules, {
  syncVModel: props.syncVModel,
  form: parentForm?.getForm(),
  label: props.label
})

const primaryWarning = computed<string | undefined>(() => {
  return primaryField.errors.value
    .map(e => {
      if (typeof (e as dynamic) !== 'string') return (e as dynamic).msg
    })
    .find(Boolean)
})

const errorMessages = computed<string[]>(() => {
  return primaryField.errors.value
    .map(e => {
      if (typeof (e as dynamic) === 'string') return e
      else return void 0
    })
    .filter(Boolean) as string[]
})

const onUpdatePrimaryModelValue = (v?: dynamic) => {
  emits('change', v)
  primaryField.setValue(v)
}

const otherModelProps: YFieldSlots = (Object.entries(_effectModels.value)
    .filter(Boolean)
    .filter(([k, v]) => Boolean(k) && Boolean(v))
    .reduce<Record<string, dynamic>>(
      (acc, [modelValueName, bindModelValueName]) => {
        const field = useField(() => bindModelValueName, void 0, {form: parentForm?.getForm(), label: props.label})
        acc[`onUpdate:${modelValueName}`] = (updateValue: dynamic) => {
          field.setValue(updateValue)
        }
        acc[modelValueName] = field.value.value
        return acc
      },
      {}
    ) as YFieldSlots)

const onUpdateErrorMessages = (errorMessages?: string[]) => {
  primaryField.setErrors(errorMessages ?? [])
}

defineSlots<{
  default?: (e?: YFieldSlots) => VNode[]
  input?: (e?: YFieldSlots) => dynamic
}>()

const slots = useSlots()
const usedDefaultSlot = computed(() => !!slots.default)
const usedInputSlot = computed(() => !!slots.input)

const _persistentHint = ref(true)

function YFormFieldProxyComponent() {
  const virtualNodes = slots.default?.()
  return virtualNodes?.map(component => {
    return h(
      component,
      mergeProps(component.props ?? {}, {
        ...otherModelProps,
        [_modelName.value]: primaryField.value.value,
        [`onUpdate:${_modelName.value}`]: onUpdatePrimaryModelValue,
        [`onUpdate:errorMessages`]: onUpdateErrorMessages,
        label: props.label,
        placeholder: props.placeholder,
        hint: primaryWarning.value,
        persistentHint: _persistentHint.value,
        errorMessages: errorMessages.value
      })
    )
  })
}
</script>

<template>
  <template v-if="usedDefaultSlot">
    <component v-bind="otherModelProps" :is="YFormFieldProxyComponent" v-if="slots?.default" />
  </template>
  <template v-if="usedInputSlot">
    <slot
      name="input"
      v-bind="otherModelProps"
      :label="props.label"
      :placeholder="props.placeholder"
      :hint="primaryWarning"
      :persistentHint="_persistentHint"
      :errorMessages="errorMessages"
      :[`${_modelName}`]="primaryField.value.value"
      :[`onUpdate:errorMessages`]="onUpdateErrorMessages"
      :[`onUpdate:${_modelName}`]="onUpdatePrimaryModelValue"
    />
  </template>
</template>
