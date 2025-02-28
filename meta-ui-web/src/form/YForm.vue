<script setup lang="ts">
import type { YFormEmits, YFormProps, YFormSlots } from '@/form/index'
import type { dynamic } from '@compose/api-types'
import type { InvalidSubmissionContext } from 'vee-validate'
import { Form as VeeForm } from 'vee-validate'

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

function handleSubmit(values: dynamic) {
  emits('submit', values)
}

function handleInvalidSubmit(ctx: InvalidSubmissionContext) {
  emits('error', ctx)
}

const formComponentRef = useTemplateRef('formComponentRef')
const exposed: YFormInjection = {
  getForm: () => formComponentRef.value ?? void 0,
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
</script>

<template>
  <VeeForm ref="formComponentRef" :validateOnMount="false" :validationSchema="_schema" :name="props.name" v-bind="$attrs" :initialValues="props.initValue" @InvalidSubmit="handleInvalidSubmit" @submit="handleSubmit">
    <template #default="p">
      <slot name="default" v-bind="p" />
    </template>
  </VeeForm>
</template>
