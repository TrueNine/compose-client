<script setup lang="ts">
//const initLocation = new window.TMap.LatLng(44, 88)
</script>

<template>
  <div h-200 px-40>
    <YMapTencent :init-center="{lat: 44, lng: 88}" api-key="YDGBZ-55T3Z-5JRX3-7DBJO-M4THS-2IF56" service-key="FXE9aQAFkeaHmzdYdue9THN5lmycBN6">
      <template #info-window="a">
        <div c-black>{{ a?.poiName }}</div>
      </template>
    </YMapTencent>
  </div>
</template>
