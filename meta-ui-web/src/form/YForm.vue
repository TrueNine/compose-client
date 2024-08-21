<script setup lang="ts">
import {type FormValidationResult, useForm} from 'vee-validate'
import type {dynamic, nil} from '@compose/api-types'
import {isEqual} from '@compose/extensions/lodash-es'
import {maybeArray} from '@compose/api-model'
import type {Schema} from 'yup'

import {type YFormEmits, type YFormInjection, YFormInjectionKey, type YFormProps} from '@/form/index'

const props = withDefaults(defineProps<YFormProps>(), {
  modelValue: void 0,
  value: void 0,
  isValid: true,
  schema: void 0,
  step: 0,
  sync: () => ({}),
  everyStep: false,
  mixins: () => ({})
})
const emits = defineEmits<YFormEmits>()

const _isValid = useVModel(props, 'isValid', emits, {passive: true}) as unknown as Ref<boolean>
const _step = useVModel(props, 'step', emits, {passive: true}) as unknown as Ref<number>
const _modelValue = useVModel(props, 'modelValue', emits, {passive: true})
const _value = useVModel(props, 'value', emits, {passive: true})
const _mixins = useVModel(props, 'mixins', emits, {passive: true, defaultValue: {}}) as unknown as Ref<Record<string, dynamic>>
const _sync = useVModel(props, 'sync', emits, {passive: true, defaultValue: {}}) as unknown as Ref<dynamic>
syncRef(_modelValue, _value)

const validatedState = computed({
  get: () => {
    const rr = usedForm.errorBag
    if (rr) {
      return Object.values(rr)
        .filter(e => typeof e === 'string')
        .every(v => !v)
    } else return true
  },
  set: v => (_isValid.value = v)
})
const stepCounter = computed(() => _cachedSchemas.value.length)
const hasPreviousStep = computed(() => _step.value > 0)
const isLastStep = computed(() => _step.value === stepCounter.value - 1)
const allValues = ref<dynamic[]>([])
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
      ...(_mixins.value ?? {}),
      ...(p ?? {}),
      ...(i === _step.value ? (_modelValue.value ?? {}) : (c ?? {}))
    }
  }, {})
})
syncRef(mergedAllValues, _sync, {direction: 'ltr', deep: true})

const stepSubmitHandle = (values: dynamic, errors?: dynamic) => {
  submitting.value = true
  try {
    console.log({
      values,
      step: _step.value,
      errors,
      mergedAllValues: mergedAllValues.value,
      isLastStep: isLastStep.value
    })
    if (props.everyStep) emits('next', values, _step.value)
    if (isLastStep.value || stepCounter.value === 1) emits('submit', mergedAllValues.value, _step.value)
  } finally {
    submitting.value = false
  }
}

const submitFn = usedForm.handleSubmit(
  vs => {
    stepSubmitHandle(vs, void 0)
  },
  ({values, errors}) => {
    const errs = Object.values(errors)
    if (errs.length) {
      // 特殊消息体被视为警告
      if ((errs as dynamic[]).every(v => typeof v !== 'string')) {
        console.log('errorSubmit')
        stepSubmitHandle(values, errors)
      } else validatedState.value = false
    } else validatedState.value = false
  }
)

const resetFn = () => {
  emits('reset', _modelValue.value, validatedState.value)
}
const formRef = ref<nil<HTMLFormElement>>(null)

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
    if (v !== o) allValues.value[v] = _modelValue.value
  }
)

function goToPrev() {
  if (!hasPreviousStep.value) return
  _step.value--
}

const getForm = () => usedForm
const getRef = () => formRef.value

const validIsError = (r: FormValidationResult<dynamic>) => {
  if (r.valid) return r.valid
  else {
    if (r.errors) {
      const errorValues = Object.values(r.errors)
      return errorValues.every(v => typeof v !== 'string')
    } else return false
  }
}

const validate = async (): Promise<boolean> => {
  const r = await usedForm.validate()
  _isValid.value = validIsError(r)
  return _isValid.value
}
function setFieldValidate(key: string, schema: Schema<dynamic, dynamic>) {
  if (_cachedSchema.value) {
    _cachedSchemas.value[(_step.value ?? 0) as number] = _cachedSchema.value?.shape({
      [key]: schema
    })
  }
}

const expose: YFormInjection = {
  getForm,
  getRef,
  validate,
  setFieldValidate
}
provide(YFormInjectionKey, expose)
defineExpose(expose)
</script>

<template>
  <form v-bind="$attrs" ref="formRef" @reset.prevent="resetFn" @submit.prevent="submitFn">
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
