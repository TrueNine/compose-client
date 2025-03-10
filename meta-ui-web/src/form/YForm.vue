<script setup lang="ts">
import type { YFormEmits, YFormProps, YFormSlots } from '@/form/index'
import { useForm } from 'vee-validate'

const props = withDefaults(defineProps<YFormProps>(), {
  step: 0,
  everyStep: false,
  modelValue: void 0,
  schema: void 0,
  initValue: void 0,
})

const emits = defineEmits<YFormEmits>()
defineSlots<YFormSlots>()
const _schema = useVModel(props, 'schema', emits, { passive: true })
const _modelValue = useVModel(props, 'modelValue', emits)
const usedForm = useForm({
  name: props.name,
  validationSchema: _schema,
  initialValues: _modelValue,
})
usedForm.handleSubmit(
  (values) => {
    emits('submit', values, props.step)
  },
  (ctx) => {
    emits('error', ctx)
  },
)

function handleSubmit(e?: Event) {
  usedForm.submitForm(e)
}

const formComponentRef = useTemplateRef('formComponentRef')

watch(_modelValue, (v) => {
  if (!formComponentRef.value) {
    return
  }
  usedForm.setValues(v)
})

watch(usedForm.values, (v) => {
  _modelValue.value = v
})

const exposed: YFormInjection = {
  getForm: () => usedForm,
  setFieldValidate: () => {
    throw new Error('Framework UnImplementation setFieldValidate')
  },
  validate: async () => {
    const result = await formComponentRef.value?.validate()
    return result?.valid ?? false
  },
}

defineExpose(exposed)
provide(YFormInjectionKey, exposed)
function handleReset() {
  usedForm.handleReset()
}
</script>

<template>
  <form
    ref="formComponentRef"
    v-bind="$attrs"
    @reset.prevent="handleReset"
    @submit.prevent="handleSubmit"
  >
    <slot name="default" />
  </form>
</template>
