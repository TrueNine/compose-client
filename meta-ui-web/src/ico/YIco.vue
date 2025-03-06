<script setup lang="ts">
import type { YIcoProps } from './index'

const props = withDefaults(defineProps<YIcoProps>(), {
  tag: 'i',
})
</script>

<template>
  <Component :is="props.tag" style="display: inline-block" class="text-6">
    <slot name="default" />
  </Component>
</template>
