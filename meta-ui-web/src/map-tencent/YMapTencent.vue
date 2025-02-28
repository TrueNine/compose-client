<script lang="ts" setup>
import type { nil } from '@compose/api-types'

import type { YMapTencentProps } from './index'
import { initTencentMapWebGlScript } from '@compose/psdk-tmap'

const props = withDefaults(defineProps<YMapTencentProps>(), {
  containerId: 'YMapTencent_Container_Wrapper',
  viewMode: '2D',
  serviceKey: void 0,
  zoom: 13,
  multiPoint: false,
  styleId: 1,
  doubleClickZoom: true,
  controlBtn: false,
  showCopyright: false,
  initCenter: () => ({ lat: 0, lng: 0 }),
  mapZoomType: () => 1,
})
const wrapperContainerHandle = useTemplateRef('wrapperContainerHandle')
let mapHandle: nil<TMap.Map> = null
let multiMarkerLayer: nil<TMap.MultiMarker> = null
let singleInfoWindow: nil<TMap.InfoWindow> = null
let search: nil<TMap.service.Search> = null
const is3dMode = ref(props.viewMode.toUpperCase() === '3D')

function to2d() {
  is3dMode.value = false
  mapHandle?.setViewMode('2D')
}

function to3d() {
  is3dMode.value = true
  mapHandle?.setViewMode('3D').setPitch(55)
}

function toCenter(latLng: TMap.LatLngDataTyping, zoom = false) {
  if (zoom)
    mapHandle?.setZoom(20)
  mapHandle?.panTo(latLng)
}

function mapInitFn(_: HTMLElement, t: typeof TMap) {
  search = new window.TMap.service.Search({
    pageSize: 20,
  })
  if (!wrapperContainerHandle.value)
    return
  mapHandle = new window.TMap.Map(wrapperContainerHandle.value, {
    center: props.initCenter,
    viewMode: props.viewMode,
    mapStyleId: `style${props.styleId.toString()}`,
    doubleClickZoom: props.doubleClickZoom,
    showControl: props.controlBtn,
    mapZoomType: props.mapZoomType,
    rotation: 0,
  })
  multiMarkerLayer = new t.MultiMarker({ map: mapHandle })

  if (!props.showCopyright) {
    const re = wrapperContainerHandle.value.querySelector('map div div div')
    if (re) {
      ;(re as unknown as HTMLElement).style.display = 'none'
    }
  }

  mapHandle.on('click', (ev) => {
    if (!mapHandle)
      return
    if (!singleInfoWindow) {
      singleInfoWindow = new t.InfoWindow({
        map: mapHandle,
        position: new t.LatLng(0, 0),
        enableCustom: true,
        offset: { x: 0, y: -32 },
      })
    }
    if (!props.multiPoint) {
      multiMarkerLayer
        ?.remove(
          multiMarkerLayer
            .getGeometries()
            .map(r => r.id)
            .filter(Boolean) as string[],
        )
        .updateGeometries([])
    }
    multiMarkerLayer?.add({ position: ev.latLng, styleId: `style${props.styleId.toString()}` })
    multiMarkerLayer?.on('click', () => {
      if (!props.multiPoint) {
        multiMarkerLayer
          ?.remove(
            multiMarkerLayer
              .getGeometries()
              .map(r => r.id)
              .filter(Boolean) as string[],
          )
          .updateGeometries([])
      }
    })
    toCenter(ev.latLng)
    if (!props.multiPoint)
      singleInfoWindow.setContent(`<div class="c-black">${ev.poi.name}</div>`).setPosition(ev.latLng).open()
    else singleInfoWindow.close()
  })
}

onMounted(() => {
  initTencentMapWebGlScript(props.apiKey, mapInitFn, {
    containerTag: 'map',
    libraries: ['service'],
    mapContainerId: props.containerId,
  })
})

onUnmounted(() => mapHandle?.destroy())

const searchAddressCode = ref<string>('')
const searchWord = ref<string>('')
const searchResults = ref<TMap.service.SearchResult['data']>([])

function searchNearby() {
  if (!props.serviceKey)
    return
  if (!mapHandle)
    return
  if (!search)
    return
  const center = mapHandle.getCenter()
  search
    .searchNearby({
      center,
      keyword: searchWord.value,
      radius: 1000,
      servicesk: props.serviceKey,
    })
    .then((e) => {
      searchResults.value = e.data
    })
    .catch((e: unknown) => {
      console.error(e)
    })
}

function searchRegion() {
  if (props.serviceKey) {
    search
      ?.searchRegion({
        cityName: searchAddressCode.value,
        keyword: searchWord.value,
        servicesk: props.serviceKey,
      })
      .then((e) => {
        searchResults.value = e.data
      })
      .catch((e: unknown) => {
        console.error(e)
      })
  }
}
</script>

<template>
  <section relative flex-col class="transition-all-500">
    <map :id="props.containerId" ref="wrapperContainerHandle" flex />
    <!-- 自定义操作句柄 -->
    <nav class="absolute left-2 top-2 z-1000">
      <slot name="view-box" :viewMode="is3dMode" :to2d="to2d" :to3d="to3d">
        <VBtnGroup>
          <VBtn size="small" :disabled="is3dMode" color="primary" @click="to3d">
            3D
          </VBtn>
          <VBtn size="small" :disabled="!is3dMode" color="primary" @click="to2d">
            2D
          </VBtn>
        </VBtnGroup>
      </slot>
    </nav>

    <!-- 操作句柄 -->
    <div class="min-w-full w-full flex">
      <slot name="search-box">
        <div class="w-full flex flex-row">
          <ElInput v-model="searchWord" />
          <VBtn color="primary" @click="searchNearby">
            search
          </VBtn>
        </div>
        <div class="w-full flex flex-row">
          <ElInput v-model="searchAddressCode" />
          <ElInput v-model="searchWord" />
          <VBtn color="primary" @click="searchRegion">
            search
          </VBtn>
        </div>
      </slot>
    </div>
    <!-- 搜索结果 -->
    <div>
      <div v-for="(it, idx) in searchResults" :key="idx" class="cursor-pointer py-1" @click="toCenter(it.location, true)">
        <VChip>{{ it.title }}</VChip>
        <span>{{ it.address }}</span>
        <VChip>{{ it.ad_info.adcode }}</VChip>
        <VDivider />
      </div>
    </div>
  </section>
</template>
