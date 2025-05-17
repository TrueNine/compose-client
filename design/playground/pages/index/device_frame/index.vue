<template>
<div class="device-row">
  <YdDeviceFace src="/design/home" />
  <YdDeviceFace src="/design/home" />
  <YdDeviceFace :rotate="90" src="/design/home" />
</div>
</template>

<style scoped lang="scss">
.device-row {
  display: flex;
  justify-content: center;
  gap: 44px;
  align-items: center;
}
</style>
