<script setup lang="ts">
import type {dynamic} from '@truenine/types'
import type {FormOptions, GenericObject, TypedSchema, TypedSchemaError} from 'vee-validate'
import type {YFormEmits, YFormInjection, YFormProps, YFormSlots} from './index'
import {toTypedSchema as yupToTypedSchema} from '@vee-validate/yup'
import {toTypedSchema as zodToTypedSchema} from '@vee-validate/zod'
import {useVModel} from '@vueuse/core'
import {useForm} from 'vee-validate'
import {computed, nextTick, provide, ref, watch} from 'vue'
import {ObjectSchema} from 'yup'
import {YFormInjectionKey} from '../form/index'

const props = withDefaults(defineProps<YFormProps>(), {
  step: 0,
  everyStep: false,
  modelValue: void 0,
  schema: void 0,
  initValue: void 0
})

const emit = defineEmits<YFormEmits>()
defineSlots<YFormSlots>()

interface ZodSchemaLike {
  _def: unknown
  parse: (values: unknown) => unknown
}

interface ZodErrorLike {
  errors: Array<{
    path: Array<string | number>
    message: string
  }>
}

function isZodSchemaLike(schema: unknown): schema is ZodSchemaLike {
  return typeof schema === 'object' && schema !== null && '_def' in schema && 'parse' in schema && typeof schema.parse === 'function'
}

function isZodErrorLike(error: unknown): error is ZodErrorLike {
  return typeof error === 'object' && error !== null && 'errors' in error && Array.isArray(error.errors)
}

const schemaModel = useVModel(props, 'schema', emit, {passive: true}) // 处理表单验证模式
const validationSchema = computed<TypedSchema<GenericObject, GenericObject> | undefined>(() => {
  const schema = schemaModel.value
  if (schema == null) return void 0

  if (isZodSchemaLike(schema)) { // Use duck typing to detect Zod schemas instead of instanceof to avoid proxy issues in tests
    if (import.meta.env.NODE_ENV === 'test' || import.meta.env.VITEST) {
      return {
        __type: 'VVTypedSchema',
        async parse(values: GenericObject) {
          const errors: TypedSchemaError[] = []
          try {
            const result = schema.parse(values) as GenericObject
            return {value: result, errors}
          }
          catch (err: unknown) {
            if (isZodErrorLike(err)) {
              err.errors.forEach(zodError => {
                errors.push({
                  path: zodError.path.join('.'),
                  errors: [zodError.message]
                })
              })
            }

            return {errors}
          }
        }
      } satisfies TypedSchema<GenericObject, GenericObject>
    }

    return zodToTypedSchema(schema) as TypedSchema<GenericObject, GenericObject>
  }
  if (schema instanceof ObjectSchema) return yupToTypedSchema(schema) as TypedSchema<GenericObject, GenericObject>
  return schema as TypedSchema<GenericObject, GenericObject>
})

const formValues = useVModel(props, 'modelValue', emit, {passive: true}) // 处理表单数据

const formConfig = computed<FormOptions<GenericObject>>(() => {
  const config: FormOptions<GenericObject> = {
    name: props.name,
    initialValues: (formValues.value as GenericObject | undefined) ?? void 0
  }

  if (validationSchema.value != null) {
    config.validationSchema = validationSchema.value
  }

  return config
})

const form = useForm<GenericObject>(formConfig.value)

const handleFormSubmit = form.handleSubmit( // 表单提交处理
  values => emit('submit', values, props.step),
  ctx => emit('error', ctx)
)

function handleSubmit(e?: Event) {
  void handleFormSubmit(e)
}

function processFormValues(newValue: dynamic) { // 对输入的值进行特殊处理
  form.setValues(newValue)
}

const isUpdating = ref(false) // 防止循环更新的标志
watch(formValues, v => {
  if (isUpdating.value) return
  isUpdating.value = true
  processFormValues(v)
  void nextTick(() => isUpdating.value = false)
}, {deep: true})

watch(form.values, v => {
  if (isUpdating.value || v === formValues.value) return // 避免循环更新

  isUpdating.value = true
  formValues.value = v
  void nextTick(() => isUpdating.value = false)
}, {deep: true})

const formContext: YFormInjection = {getForm: () => form, setFieldValidate: () => {
  throw new Error('Framework UnImplementation setFieldValidate')
}, validate: async () => (await form.validate()).valid}

provide(YFormInjectionKey, formContext)

function handleReset() {
  emit('reset', form.values)
  form.handleReset()
}

setTimeout(() => void form.setFieldError('a.b', 'error'), 2000)
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
