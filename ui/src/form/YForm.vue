<script setup lang="ts">
import type { YFormEmits, YFormInjection, YFormProps, YFormSlots } from '@/form/index'
import type { dynamic } from '@compose/types'
import { YFormInjectionKey } from '@/form/index'
import { toTypedSchema as yupToTypedSchema } from '@vee-validate/yup'
import { toTypedSchema as zodToTypedSchema } from '@vee-validate/zod'
import { useVModel } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { computed, nextTick, provide, ref, watch } from 'vue'
import { ObjectSchema } from 'yup'
import { ZodType } from 'zod'

const props = withDefaults(defineProps<YFormProps>(), {
  step: 0,
  everyStep: false,
  modelValue: void 0,
  schema: void 0,
  initValue: void 0,
})

const emits = defineEmits<YFormEmits>()
defineSlots<YFormSlots>()
const __schema = useVModel(props, 'schema', emits, { passive: true })
const _schema = computed(() => {
  const s = __schema.value
  if (s instanceof ZodType) {
    return zodToTypedSchema(s)
  }
  if (s instanceof ObjectSchema) {
    return yupToTypedSchema(s)
  }
  return s
})
const _modelValue = useVModel(props, 'modelValue', emits)
const usedForm = useForm({
  name: props.name,
  validationSchema: _schema,
  initialValues: _modelValue,
})
const submitHandler = usedForm.handleSubmit(
  (values) => {
    emits('submit', values, props.step)
  },
  (ctx) => {
    emits('error', ctx)
  },
)

function handleSubmit(e?: Event) {
  void submitHandler(e)
}

// 对输入的值进行特殊处理
function processFormValues(newValue: dynamic) {
  usedForm.setValues(newValue)
}

// 防止循环更新的标志
const isUpdatingFormModelValue = ref(false)
watch(_modelValue, (v) => {
  if (isUpdatingFormModelValue.value) {
    return
  }
  isUpdatingFormModelValue.value = true
  processFormValues(v)
  void nextTick(() => {
    isUpdatingFormModelValue.value = false
  })
}, { deep: true })

watch(usedForm.values, (v) => {
  // 避免循环更新
  if (isUpdatingFormModelValue.value || v === _modelValue.value) {
    return
  }

  isUpdatingFormModelValue.value = true
  _modelValue.value = v
  void nextTick(() => {
    isUpdatingFormModelValue.value = false
  })
}, { deep: true })

const exposed: YFormInjection = {
  getForm: () => usedForm,
  setFieldValidate: () => {
    throw new Error('Framework UnImplementation setFieldValidate')
  },
  validate: async () => {
    return (await usedForm.validate()).valid
  },
}

provide(YFormInjectionKey, exposed)

function handleReset() {
  usedForm.handleReset()
}

setTimeout(() => {
  void usedForm.setFieldError('a.b', 'error')
}, 2000)
defineExpose(exposed)
</script>

<template>
<form
  @reset="handleReset"
  @submit.prevent="ev => handleSubmit(ev)"
>
  <slot
    :reset="handleReset"
    :submit="submitHandler"
    :disabled="Object.keys(usedForm.errorBag.value).length >= 1"
    :isSubmitting="usedForm.isSubmitting.value"
    name="default"
  />
  <slot
    name="submit"
    :reset="handleReset"
    :submit="submitHandler"
    :disabled="Object.keys(usedForm.errorBag.value).length >= 1"
    :isSubmitting="usedForm.isSubmitting.value"
  />
</form>
</template>
