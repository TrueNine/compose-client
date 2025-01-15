<script setup lang="ts">
import type {FormValidationResult} from 'vee-validate'
import {useForm} from 'vee-validate'
import type {dynamic} from '@compose/api-types'
import {isEqual} from '@compose/extensions/lodash-es'
import {maybeArray} from '@compose/api-model'
import type {Schema} from 'yup'
import {YFormInjectionKey} from '@/form/index'
import type {YFormEmits, YFormInjection, YFormProps} from '@/form/index'

const props = withDefaults(defineProps<YFormProps>(), {
  step: 0,
  everyStep: false,
  modelValue: void 0,
  value: void 0,
  schema: void 0,
  mixins: () => ({})
})

const emits = defineEmits<YFormEmits>()
const isSubmitting = ref(false)
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
const stepCounter = computed(() => allSchemas.value.length)
const hasPreviousStep = computed(() => _step.value > 0)
const isLastStep = computed(() => _step.value === stepCounter.value - 1)
// 所以当前的值
const allValues: dynamic[] = []

// 响应  props.schema
const _propsSchema = reactive({
  value: props.schema
})
watch(
  () => props.schema,
  v => (_propsSchema.value = v)
)

const allSchemas = computed({
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

const currentSchema = computed(() => allSchemas.value[_step.value])

const usedForm = useForm({
  validateOnMount: false,
  validationSchema: currentSchema,
  initialValues: _modelValue
})
syncRef(usedForm.values, _modelValue, {
  immediate: true,
  deep: true,
  direction: 'ltr'
})

function clipProp(obj: dynamic, dep = 0): dynamic {
  if (obj === void 0 || obj === null) return obj
  if (obj === '') return void 0
  if (typeof obj !== 'object') return obj
  if (obj && typeof obj === 'object' && Object.keys(obj).length === 0) return void 0
  if (Array.isArray(obj)) {
    return obj.map(item => clipProp(item, dep + 1)).filter(item => item !== void 0)
  } else {
    const newObj: Record<string, dynamic> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = clipProp(obj[key], dep + 1)
        if (value !== void 0) {
          newObj[key] = value
        }
      }
    }
    return Object.keys(newObj).length === 0 ? void 0 : newObj
  }
}

function mergedAllValues() {
  const submitResult = allValues.reduce((p, c, i) => {
    return {
      ...(_mixins.value ?? {}),
      ...(p ?? {}),
      ...(i === _step.value ? (_modelValue.value ?? {}) : (c ?? {}))
    }
  }, {})

  // 使用 cloneDeepWith 进行深度遍历和替换
  const result = clipProp(submitResult)
  if (Object.keys(result).length === 0) {
    return void 0
  }

  return result
}

function stepSubmitHandle(values: dynamic) {
  isSubmitting.value = true
  try {
    if (props.everyStep) emits('next', values, _step.value)
    if (isLastStep.value || stepCounter.value === 1) {
      emits('submit', mergedAllValues(), _step.value)
    }
  } finally {
    isSubmitting.value = false
  }
}

const submitFn = usedForm.handleSubmit(
  vs => {
    stepSubmitHandle(vs)
  },
  ({errors, values}) => {
    const errs = Object.values(errors)
    if (errs.length) {
      // 特殊消息体被视为警告
      if ((errs as dynamic[]).every(v => typeof (v as dynamic) !== 'string')) {
        stepSubmitHandle(values)
      } else validatedState.value = false
    } else validatedState.value = false
  }
)

function resetFn() {
  emits('reset', _modelValue.value, validatedState.value)
}

/**
 * 第一次执行监听
 */
let firstExecuted = false

/**
 * 当 modelValue or sync value 更新时触发
 * @param allFieldValues 新 modelValue
 * @param oldValue 旧 modelValue
 */
function watchSyncFn(allFieldValues?: Record<string, dynamic>, oldValue?: Record<string, dynamic>) {
  _isValid.value = true
  if (isEqual(allFieldValues, oldValue)) return
  if (allFieldValues === null || allFieldValues === void 0) return
  if (firstExecuted) {
    emits('change', allFieldValues)
  }
  usedForm.setValues(allFieldValues)
}

watch(_modelValue, watchSyncFn, {deep: true})
watch(_sync, watchSyncFn, {deep: true}) // TODO 确定其是否有副作用

watch(
  _step,
  (v, o) => {
    if (v < _step.value) _isValid.value = true
    if (v !== o) allValues[v] = _modelValue.value
    firstExecuted = true
  },
  {immediate: true}
)

function goToPrev() {
  if (!hasPreviousStep.value) return
  _step.value--
}

function getForm() {
  return usedForm
}

function validIsError(r: FormValidationResult<dynamic>) {
  if (r.valid) return r.valid
  else {
    if (r.errors) {
      const errorValues = Object.values(r.errors)
      return errorValues.every(v => typeof v !== 'string')
    } else return false
  }
}

async function validate(): Promise<boolean> {
  const r = await usedForm.validate()
  _isValid.value = validIsError(r)
  return _isValid.value
}

function setFieldValidate(key: string, schema: Schema<dynamic, dynamic>) {
  if (currentSchema.value) {
    const customSchema = {[key]: schema}
    const shape = currentSchema.value.shape(customSchema)
    allSchemas.value = [shape]
    _newSchemas.value[_step.value] = customSchema
  }
}

const expose: YFormInjection = {
  getForm,
  validate,
  setFieldValidate
}
defineExpose(expose)
provide(YFormInjectionKey, expose)
</script>

<template>
  <form v-bind="$attrs" @reset.prevent="resetFn" @submit.prevent="submitFn">
    <slot
      :prev="goToPrev"
      :submitting="isSubmitting"
      :isValid="validatedState"
      :submit="submitFn"
      :reset="resetFn"
      :step="_step"
      :validate="validate"
      name="default"
    />
  </form>
</template>
