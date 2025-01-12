<script setup lang="ts">
import type {FormValidationResult} from 'vee-validate'
import {useForm} from 'vee-validate'
import type {dynamic, nil} from '@compose/api-types'
import {isEqual} from '@compose/extensions/lodash-es'
import {maybeArray} from '@compose/api-model'
import type {Schema} from 'yup'
import {useTemplateRef} from 'vue'

import {type YFormEmits, type YFormInjection, YFormInjectionKey, type YFormProps} from '@/form/index'

const props = withDefaults(defineProps<YFormProps>(), {
  step: 0,
  everyStep: false,
  modelValue: void 0,
  value: void 0,
  schema: void 0,
  mixins: () => ({})
})
const emits = defineEmits<YFormEmits>()

const _isValid = useVModel(props, 'isValid', emits, {passive: true})
const _step = useVModel(props, 'step', emits, {passive: true})
const _modelValue = useVModel(props, 'modelValue', emits, {passive: true})
const _mixins = useVModel(props, 'mixins', emits, {passive: true, defaultValue: {}})
const _sync = useVModel(props, 'sync', emits, {passive: true, defaultValue: {}})

const _newSchemas = ref<Record<string, Schema<dynamic, dynamic>>[]>([])

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

// 响应  props.schema
const _propsSchema = reactive({
  value: props.schema
})
watch(
  () => props.schema,
  v => (_propsSchema.value = v)
)

const _cachedSchemas = computed({
  get: () => {
    const arr = maybeArray(_propsSchema.value)
    return arr.map((e, i) => {
      const n = _newSchemas.value[i]
      return n ? e?.shape(n) : e
    })
  },
  set: v => {
    const s = v[0]
    if (s) {
      if (Array.isArray(_propsSchema.value)) {
        const cp = _propsSchema.value
        cp[_step.value] = _newSchemas.value[_step.value] ? s : (s as dynamic).shape()
        _propsSchema.value = cp
      } else _propsSchema.value = s
    }
  }
})

const _cachedSchema = computed(() => _cachedSchemas.value[_step.value])

const usedForm = useForm({
  validateOnMount: false,
  validationSchema: _cachedSchema,
  initialValues: _modelValue.value
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

const stepSubmitHandle = (values: dynamic) => {
  submitting.value = true
  try {
    if (props.everyStep) emits('next', values, _step.value)
    if (isLastStep.value || stepCounter.value === 1) emits('submit', mergedAllValues.value, _step.value)
  } finally {
    submitting.value = false
  }
}

const submitFn = usedForm.handleSubmit(
  vs => {
    stepSubmitHandle(vs)
  },
  ({values, errors}) => {
    const errs = Object.values(errors)
    if (errs.length) {
      // 特殊消息体被视为警告
      if ((errs as dynamic[]).every(v => typeof v !== 'string')) {
        stepSubmitHandle(values)
      } else validatedState.value = false
    } else validatedState.value = false
  }
)

const resetFn = () => {
  emits('reset', _modelValue.value, validatedState.value)
}

const formRef = useTemplateRef<nil<HTMLFormElement>>('formRef')

syncRef(usedForm.values, _modelValue, {
  immediate: true,
  deep: true,
  direction: 'ltr'
})

const watchSyncFn = (v: dynamic, oldValue: dynamic) => {
  _isValid.value = true
  if (isEqual(v, oldValue)) return
  if (v) {
    Object.keys(v as unknown as Record<string, dynamic>).forEach(key => {
      const o1 = oldValue?.[key]
      const v1 = v[key]
      if (v1 !== o1) {
        if (allValues.value[_step.value]) allValues.value[_step.value][key] = v1
        else allValues.value[_step.value] = {[key]: v1}
        usedForm.setFieldValue(key as dynamic, v1)
      }
    })
  }
}
watch(() => _modelValue.value, watchSyncFn, {deep: true, immediate: true})
watch(() => _sync.value, watchSyncFn, {deep: true, immediate: true})

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
    const customSchema = {[key]: schema}
    const shape = _cachedSchema.value.shape(customSchema)
    _cachedSchemas.value = [shape]
    _newSchemas.value[_step.value] = customSchema
  }
}

const expose: YFormInjection = {
  getForm,
  getRef,
  validate,
  setFieldValidate
}
defineExpose(expose)
provide(YFormInjectionKey, expose)
</script>

<template>
  <form v-bind="$attrs" ref="formRef" @reset.prevent="resetFn" @submit.prevent="submitFn">
    <slot
      :prev="goToPrev"
      :formRef="formRef!"
      :submitting="submitting"
      :isValid="validatedState"
      :submit="submitFn"
      :reset="resetFn"
      :step="_step"
      :validate="validate"
      name="default"
    />
  </form>
</template>
