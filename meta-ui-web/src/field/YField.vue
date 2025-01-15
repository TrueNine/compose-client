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

const defaultRules = ref<late<Schema<dynamic, dynamic>>>(props.schema)
const parentForm = inject(YFormInjectionKey, void 0)
const primaryField = useField(() => props.name, defaultRules, {syncVModel: props.syncVModel, form: parentForm?.getForm()})

const primaryWarning = computed<string | undefined>(() => {
  return primaryField.errors.value
    .map(e => {
      if (typeof (e as dynamic) !== 'string') return (e as dynamic).msg
    })
    .filter(Boolean)[0]
})

const primaryErrors = computed<string[]>(() => {
  return primaryField.errors.value
    ?.map(e => {
      if (typeof (e as dynamic) === 'string') return e
      else return void 0
    })
    .filter(Boolean)
    .map(e => e as string)
})

const setPrimaryFieldValueFn = (v?: dynamic) => {
  primaryField.setValue(v)
}

const otherModelProps: YFieldSlots = {
  ...(Object.entries(_effectModels.value)
    .filter(Boolean)
    .filter(([k, v]) => Boolean(k) && Boolean(v))
    .reduce(
      (acc, [k, v]) => {
        const field = useField(() => v)
        acc[`onUpdate:${k}`] = (v: dynamic) => {
          field.setValue(v)
        }
        acc[k] = field.value.value
        return acc
      },
      {} as Record<string, dynamic>
    ) as YFieldSlots)
} as YFieldSlots

const onUpdateErrorMessages = (v?: string[]) => {
  primaryField.setErrors(v! as unknown as string[])
}

defineSlots<{
  default?: (e?: YFieldSlots) => VNode[]
  input?: (e?: YFieldSlots) => dynamic
}>()

const slots = useSlots()
const usedDefaultSlot = computed(() => !!slots?.default)
const usedInputSlot = computed(() => !!slots?.input)

const _persistentHint = ref(true)

function DefaultSlotComponent() {
  const virtualNodes = slots?.default?.()
  return virtualNodes?.map(e => {
    return h(
      e,
      mergeProps(e.props ?? {}, {
        ...otherModelProps,
        [`${_modelName.value}`]: primaryField.value.value,
        [`onUpdate:${_modelName.value}`]: setPrimaryFieldValueFn,
        [`onUpdate:errorMessages`]: onUpdateErrorMessages,
        label: props.label,
        placeholder: props.placeholder,
        hint: primaryWarning.value,
        persistentHint: _persistentHint.value,
        errorMessages: primaryErrors.value
      })
    )
  })
}
</script>

<template>
  <template v-if="usedDefaultSlot">
    <component v-bind="otherModelProps" :is="DefaultSlotComponent" v-if="slots?.default" />
  </template>
  <template v-if="usedInputSlot">
    <slot
      name="input"
      v-bind="otherModelProps"
      :label="props.label"
      :placeholder="props.placeholder"
      :hint="primaryWarning"
      :persistentHint="_persistentHint"
      :errorMessages="primaryErrors"
      :[`${_modelName}`]="primaryField.value.value"
      :[`onUpdate:errorMessages`]="onUpdateErrorMessages"
      :[`onUpdate:${_modelName}`]="setPrimaryFieldValueFn"
    />
  </template>
</template>
