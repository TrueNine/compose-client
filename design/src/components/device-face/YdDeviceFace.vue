<script setup lang="ts">
interface Props {
  /**
   * 需要展示的页面地址（支持完整网址或本地路由）
   */
  src: string
  /**
   * 旋转角度（单位：度）
   */
  rotate?: number
}

const props = withDefaults(defineProps<Props>(), {
  rotate: 0,
})

const emit = defineEmits<{
  /**
   * 旋转时触发
   * @param angle 当前角度
   */
  rotate: [angle: number]
}>()

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

<style scoped lang="scss">
.yd-iphone15-black-outer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22rem;
  height: 44rem;
  background: transparent;
  border-radius: 3rem;
  box-shadow: 0 0.7rem 2.5rem #0005;
  overflow: visible;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.yd-iphone15-black-bezel {
  position: relative;
  width: 100%;
  height: 100%;
  background: #18181a;
  border-radius: 2.7rem;
  box-shadow: 0 0.1rem 0.5rem #0003 inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  z-index: 1;
}
.yd-iphone15-black-screen {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  right: 0.6rem;
  bottom: 0.6rem;
  border-radius: 2.2rem;
  background: #111;
  overflow: hidden;
  z-index: 2;
}
.yd-device-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 2.1rem;
  background: #fff;
  overflow: hidden;
}
.yd-iphone15-hole-island {
  position: absolute;
  top: 1.1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 7rem;
  height: 1.5rem;
  background: #18181a;
  border-radius: 0.75rem;
  box-shadow:
    0 0.08rem 0.18rem #0008,
    0 0.05rem 0.1rem #fff1 inset;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border: 0.04rem solid #222c;
}
.yd-iphone15-hole-camera {
  width: 0.28rem;
  height: 0.28rem;
  background: radial-gradient(circle at 60% 40%, #5af 60%, #222 100%);
  border-radius: 50%;
  margin-left: 4.18rem;
  box-shadow: 0 0 0.08rem #000a;
}
.yd-device-loading-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.18) 0%, rgba(0, 0, 0, 0) 40%), #000;
  z-index: 10;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.yd-device-loading-mask.loaded {
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (max-width: 600px) {
  .yd-iphone15-black-outer {
    width: 90vw;
    height: 180vw;
    min-width: 16rem;
    min-height: 32rem;
  }
}
</style>
