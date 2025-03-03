<script setup lang="ts">
import type { YFieldEmits, YFieldProps, YFieldSlots, YFieldSlotsProps } from '@/field/index'
import type { dynamic, Maybe } from '@compose/api-types'
import { maybeArray } from '@compose/api-model'
import { useField } from 'vee-validate'
import { mergeProps } from 'vue'

const props = withDefaults(defineProps<YFieldProps>(), {
  modelValue: void 0,
  modelName: 'modelValue',
  rule: void 0,
})
const emits = defineEmits<YFieldEmits>()
const slots = defineSlots<YFieldSlots>()

const _name = useVModel(props, 'name', emits, { passive: true })
const _modelName = useVModel(props, 'modelName', emits, { passive: true })
const _modelValue = useVModel(props, 'modelValue', emits, { passive: true })
const _rule = useVModel(props, 'rule', emits, { passive: true })
const _errorMessages = useVModel(props, 'errorMessages', emits, { passive: true })
const __effectModelsVModel = useVModel(props, 'effectModels', emits, { passive: true })
const _effectModels = computed(() => {
  const mo = __effectModelsVModel.value
  if (!mo) {
    return {}
  }
  const res = maybeArray(mo).map((e) => {
    if (typeof e === 'string')
      return { [e]: e }
    else return e
  })

  return res.reduce<Record<string, string>>((acc, cur) => {
    return { ...acc, ...cur }
  }, {})
})

const field = useField(_name, _rule, { label: props.label })

function onUpdateValue(v?: dynamic) {
  emits('change', v)
  field.setValue(v)
  _modelValue.value = v
}

function onUpdateErrorMessages(errorMessages?: Maybe<string>) {
  const msg = errorMessages ?? []
  field.setErrors(maybeArray(msg))
  _errorMessages.value = msg
}

const otherModelProps = Object.entries(_effectModels.value)
  .filter(Boolean)
  .filter(([k, v]) => Boolean(k) && Boolean(v))
  .reduce<Record<string, dynamic>>((acc, [modelValueName, bindModelValueName]) => {
    const field = useField(() => bindModelValueName, void 0, { label: props.label })
    acc[`onUpdate:${modelValueName}`] = (updateValue: dynamic) => {
      field.setValue(updateValue)
    }
    acc[modelValueName] = field.value.value
    return acc
  }, {})

function YFormFieldProxyComponent(props?: YFieldSlotsProps) {
  const virtualNodes = slots.default?.(props)
  return virtualNodes?.map((component: dynamic) => {
    return h(
      component,
      mergeProps(component.props ?? {}, {
        ...otherModelProps,
        [_modelName.value]: field.value.value,
        [`onUpdate:${_modelName.value}`]: onUpdateValue,
        [`onUpdate:errorMessages`]: onUpdateErrorMessages,
        label: props?.label,
        placeholder: props?.placeholder,
        hint: void 0,
        persistentHint: true,
        errorMessages: field.errors.value,
      }),
    )
  })
}

const usedDefaultSlot = computed(() => !!slots.default)
</script>

<template>
  <template v-if="usedDefaultSlot">
    <component v-bind="props" :is="YFormFieldProxyComponent" v-if="slots?.default" />
  </template>
</template>
