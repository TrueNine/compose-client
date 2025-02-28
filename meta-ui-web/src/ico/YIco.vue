<script setup lang="ts">
import type { YIcoProps } from './index'

const props = withDefaults(defineProps<YIcoProps>(), {
  tag: 'i',
})
</script>

<template>
  <Component :is="props.tag" class="inline-block text-6">
    <slot name="default" />
  </Component>
</template>
