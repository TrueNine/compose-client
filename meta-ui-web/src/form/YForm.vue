<script setup lang="ts">
import {useForm} from 'vee-validate'
import type {dynamic, late, nil} from '@compose/api-types'
import {isEqual} from '@compose/extensions/lodash-es'
import {maybeArray} from '@compose/api-model'

import type {YFormEmits, YFormProps} from '@/form/index'

const props = withDefaults(defineProps<YFormProps>(), {
  modelValue: void 0,
  value: void 0,
  isValid: true,
  schema: void 0,
  step: 0,
  everyStep: false
})
const emits = defineEmits<YFormEmits>()

const _isValid = useVModel(props, 'isValid', emits, {passive: true}) as unknown as Ref<boolean>
const _step = useVModel(props, 'step', emits, {passive: true}) as unknown as Ref<number>
const _modelValue = useVModel(props, 'modelValue', emits, {passive: true})
const _value = useVModel(props, 'value', emits, {passive: true})
const _mixins = useVModel(props, 'mixins', emits, {passive: true}) as unknown as Ref<Record<string, dynamic>>

syncRef(_modelValue as Ref<dynamic>, _value as Ref<dynamic>)

const validatedState = computed({
  get: () => {
    const rr = usedForm.errorBag
    if (rr) {
      const isValid = Object.values(rr)
        .filter(e => typeof e === 'string')
        .every(v => !v)
      ;(_isValid.value as unknown as late<boolean>) = isValid
      return isValid
    } else return true
  },
  set: v => {
    ;(_isValid.value as unknown as late<boolean>) = v
  }
})
const stepCounter = computed(() => _cachedSchemas.value.length)
const hasPrevious = computed(() => _step.value > 0)
const isLastStep = computed(() => _step.value === stepCounter.value)

const _cachedSchemas = computed(() => maybeArray(props.schema))
const _cachedSchema = computed(() => _cachedSchemas.value[(_step.value ?? 0) as number])

const usedForm = useForm({
  validateOnMount: false,
  validationSchema: _cachedSchema,
  initialValues: _modelValue.value ?? _value.value
})

const submitting = ref(false)
const mergedAllValues = computed(() => {
  return allValues.value.reduce((p, c, i) => {
    return {
      ...p,
      ...(i === _step.value ? _modelValue.value : c),
      ..._mixins.value
    }
  }, {})
})
const stepSubmitHandle = (values: dynamic, errors?: dynamic) => {
  try {
    submitting.value = true
    console.log({
      values,
      step: _step.value,
      errors,
      mergedAllValues: mergedAllValues.value,
      isLastStep: isLastStep.value
    })

    allValues.value[_step.value] = values
    if (props.everyStep || _cachedSchemas.value.length === 1) {
      emits('submit', values, _step.value)
    } else if (!isLastStep.value) {
      emits('next', values, _step.value)
      _step.value++
    } else if (isLastStep.value) {
      emits('submit', mergedAllValues.value, _step.value)
    }
  } finally {
    submitting.value = false
  }
}

const submitFn = usedForm.handleSubmit(
  vs => {
    const submitValue = props.everyStep ? mergedAllValues.value : vs
    stepSubmitHandle(submitValue, void 0)
  },
  ({values, errors}) => {
    const errs = Object.values(errors)
    if (errs.length) {
      // 特殊消息体被视为警告
      if (errs.every(v => typeof v !== 'string')) {
        console.log('errorSubmit')
        const submitValue = props.everyStep ? mergedAllValues.value : values
        stepSubmitHandle(submitValue, errors)
      } else validatedState.value = false
    } else validatedState.value = false
  }
)

const resetFn = () => {
  emits('reset', _modelValue.value, validatedState.value)
}
const formRef = ref<nil<HTMLFormElement>>(null)
const allValues = ref<dynamic[]>([])

syncRef(usedForm.values as Ref<dynamic>, _modelValue as Ref<dynamic>, {
  immediate: true,
  deep: true,
  direction: 'ltr'
})

watch(
  () => _modelValue.value,
  (v, oldValue) => {
    _isValid.value = true
    if (isEqual(v, oldValue)) return
    if (v) {
      Object.keys(v as unknown as Record<string, dynamic>).forEach(key => {
        const oValue = oldValue?.[key]
        const vValue = v[key]
        if (vValue !== oValue) {
          usedForm.setFieldValue(key as dynamic, v[key])
        }
      })
      allValues.value[_step.value] = v
    }
  },
  {deep: true}
)

watch(
  () => _step.value,
  async (v, o) => {
    if (v < o) _isValid.value = true
    if (v !== o) allValues.value[_step.value] = _modelValue.value
  }
)

function goToPrev() {
  if (!hasPrevious.value) return
  _step.value--
}

const getForm = () => usedForm
const validate = async () => {
  console.log(`trigger validate step = ${_step.value}`)
  const r = await usedForm.validate()
  return r.valid && !r.errors
}
defineExpose({
  getForm
})
</script>

<template>
  <form ref="formRef" @reset.prevent="resetFn" @submit.prevent="submitFn">
    <slot
      :prev="goToPrev"
      :form-ref="formRef!"
      :submitting="submitting"
      :is-valid="validatedState"
      :submit="submitFn"
      :reset="resetFn"
      :step="_step"
      :validate="validate"
      name="default"
    />
  </form>
</template>
