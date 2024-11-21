<script setup lang="ts">
import {string} from 'yup'

import type {FormFieldEmits, FormFieldProps} from '@/common'
const props = withDefaults(defineProps<FormFieldProps<string>>(), {
  defaultValidateSchema: () => string().max(3).required()
})
const emits = defineEmits<FormFieldEmits<string>>()
const mv = useVModel(props, 'modelValue', emits, {passive: true})
</script>

<template>
  <VTextField v-model="mv" :errorMessages="errorMessages" />
</template>
