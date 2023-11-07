<script setup lang="ts"></script>

<template>
  <div flex justify-center>
    <div class="md:w-1/2 sm:w-95/100" transition-all duration-300>
      <YMapTencent :style-id="1" :init-center="{lat: 44, lng: 88}" api-key="YDGBZ-55T3Z-5JRX3-7DBJO-M4THS-2IF56" service-key="FXE9aQAFkeaHmzdYdue9THN5lmycBN6">
        <template #info-window="a">
          <div c-black>
            {{ a?.poiName }}
          </div>
        </template>
      </YMapTencent>
    </div>
  </div>
</template>
