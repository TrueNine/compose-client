<script setup lang="ts">
import type { dynamic } from '@compose/types'
import type { YFormEmits, YFormInjection, YFormProps, YFormSlots } from '@/form/index'
import { toTypedSchema as yupToTypedSchema } from '@vee-validate/yup'
import { toTypedSchema as zodToTypedSchema } from '@vee-validate/zod'
import { useVModel } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { computed, nextTick, provide, ref, watch } from 'vue'
import { ObjectSchema } from 'yup'
import { ZodType } from 'zod'
import { YFormInjectionKey } from '@/form/index'

const props = withDefaults(defineProps<YFormProps>(), {
  step: 0,
  everyStep: false,
  modelValue: void 0,
  schema: void 0,
  initValue: void 0,
})

const emit = defineEmits<YFormEmits>()
defineSlots<YFormSlots>()

// 处理表单验证模式
const schemaModel = useVModel(props, 'schema', emit, { passive: true })
const validationSchema = computed(() => {
  const schema = schemaModel.value
  if (schema instanceof ZodType) {
    return zodToTypedSchema(schema)
  }
  if (schema instanceof ObjectSchema) {
    return yupToTypedSchema(schema)
  }
  return schema
})

// 处理表单数据
const formValues = useVModel(props, 'modelValue', emit, { passive: true })
const form = useForm({
  name: props.name,
  validationSchema,
  initialValues: formValues,
})

// 表单提交处理
const handleFormSubmit = form.handleSubmit(
  (values) => {
    emit('submit', values, props.step)
  },
  (ctx) => {
    emit('error', ctx)
  },
)

function handleSubmit(e?: Event) {
  void handleFormSubmit(e)
}

// 对输入的值进行特殊处理
function processFormValues(newValue: dynamic) {
  form.setValues(newValue)
}

// 防止循环更新的标志
const isUpdating = ref(false)
watch(formValues, (v) => {
  if (isUpdating.value) {
    return
  }
  isUpdating.value = true
  processFormValues(v)
  void nextTick(() => {
    isUpdating.value = false
  })
}, { deep: true })

watch(form.values, (v) => {
  // 避免循环更新
  if (isUpdating.value || v === formValues.value) {
    return
  }

  isUpdating.value = true
  formValues.value = v
  void nextTick(() => {
    isUpdating.value = false
  })
}, { deep: true })

const formContext: YFormInjection = {
  getForm: () => form,
  setFieldValidate: () => {
    throw new Error('Framework UnImplementation setFieldValidate')
  },
  validate: async () => {
    return (await form.validate()).valid
  },
}

provide(YFormInjectionKey, formContext)

function handleReset() {
  emit('reset', form.values)
  form.handleReset()
}

setTimeout(() => {
  void form.setFieldError('a.b', 'error')
}, 2000)
defineExpose(formContext)
</script>

<template>
<form
  @reset="handleReset"
  @submit.prevent="ev => handleSubmit(ev)"
>
  <slot
    :reset="handleReset"
    :submit="handleFormSubmit"
    :disabled="Object.keys(form.errorBag.value).length >= 1"
    :isSubmitting="form.isSubmitting.value"
    name="default"
  />
  <slot
    name="submit"
    :reset="handleReset"
    :submit="handleFormSubmit"
    :disabled="Object.keys(form.errorBag.value).length >= 1"
    :isSubmitting="form.isSubmitting.value"
  />
</form>
</template>
