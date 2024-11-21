<script setup lang="ts"></script>

<template>
  <div flex justify-center>
    <div class="md:w-1/2 sm:w-95/100" transition-all duration-300>
      <YMapTencent :styleId="1" :initCenter="{lat: 44, lng: 88}" apiKey="YDGBZ-55T3Z-5JRX3-7DBJO-M4THS-2IF56" serviceKey="FXE9aQAFkeaHmzdYdue9THN5lmycBN6">
        <template #info-window="stepNodes">
          <div c-black>
            {{ stepNodes?.poiName }}
          </div>
        </template>
      </YMapTencent>
    </div>
  </div>
</template>
