<script setup lang="ts">
import type { YdDeviceFaceEmits, YdDeviceFaceProps } from './index'
import './index.scss'

const props = withDefaults(defineProps<YdDeviceFaceProps>(), {
  rotate: 0,
})

const emit = defineEmits<YdDeviceFaceEmits>()

const iframeRef = useTemplateRef('iframeRef')
const isLoaded = ref(false)

watch(() => props.rotate, (val) => {
  emit('rotate', val)
})

function injectScrollbarStyle() {
  const iframe = iframeRef.value
  if (!iframe) {
    return
  }
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) {
      return
    }
    const style = doc.createElement('style')
    style.innerHTML = `
      ::-webkit-scrollbar { width: 0 !important; height: 0 !important; background: transparent !important; }
      html { scrollbar-width: none !important; -ms-overflow-style: none !important; }
    `
    doc.head.appendChild(style)
  } catch {
    // 跨域iframe无法注入，忽略
  }
}

function handleLoad() {
  injectScrollbarStyle()
  isLoaded.value = true
}
</script>

<template>
<div
  class="yd-iphone15-black-outer"
  :style="{ transform: `rotate(${props.rotate}deg)` }"
>
  <div class="yd-iphone15-black-bezel">
    <!-- 灵动岛 -->
    <div class="yd-iphone15-hole-island">
      <div class="yd-iphone15-hole-camera" />
    </div>
    <div class="yd-iphone15-black-screen">
      <iframe
        ref="iframeRef"
        class="yd-device-iframe"
        :src="props.src"
        frameborder="0"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        @load="handleLoad"
      />
      <div
        class="yd-device-loading-mask"
        :class="{ loaded: isLoaded }"
      />
    </div>
  </div>
</div>
</template>
