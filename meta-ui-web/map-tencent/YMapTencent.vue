<script lang="ts" setup>
import type {TMap} from '@compose/psdk-tmap'
import {BasicMapZoomType, initTencentMapWebGlScript, LazyGetMapZoomType} from '@compose/psdk-tmap'
import type {Nullable} from '@compose/api-types'

import type {YMapTencentProps} from './index'

const mapDefaultContainerId: string = 'YMapTencent_Container_Wrapper'
const wrapperContainerHandle = ref<HTMLElement | null>(null)
let mapHandle: Nullable<TMap.Map> = null
let multiMarkerLayer: Nullable<TMap.MultiMarker> = null
let singleInfoWindow: Nullable<TMap.InfoWindow> = null
let search: Nullable<TMap.service.Search> = null
const props = withDefaults(defineProps<YMapTencentProps>(), {
  containerId: mapDefaultContainerId,
  viewMode: '2D',
  serviceKey: undefined,
  zoom: 13,
  multiPoint: false,
  styleId: 1,
  doubleClickZoom: true,
  controlBtn: false,
  showCopyright: false,
  initCenter: () => ({lat: 0, lng: 0}),
  mapZoomType: () => BasicMapZoomType.DEFAULT
})
const is3dMode = ref(props.viewMode.toUpperCase() === '3D')

const to2d = () => {
  is3dMode.value = false
  mapHandle?.setViewMode('2D')
}
const to3d = () => {
  is3dMode.value = true
  mapHandle?.setViewMode('3D').setPitch(55)
}

const toCenter = (latLng: TMap.LatLngDataTyping, zoom: boolean = false) => {
  if (zoom) mapHandle?.setZoom(20)
  mapHandle?.panTo(latLng)
}

const mapInitFn = (_: HTMLElement, t: typeof TMap) => {
  search = new window.TMap.service.Search({
    pageSize: 20
  })
  mapHandle = new window.TMap.Map(wrapperContainerHandle.value!, {
    center: props.initCenter,
    viewMode: props.viewMode,
    mapStyleId: `style${props.styleId}`,
    doubleClickZoom: props.doubleClickZoom,
    showControl: props.controlBtn,
    mapZoomType: LazyGetMapZoomType.getTencentMapZoomType(props.mapZoomType!),
    rotation: 0
  })
  multiMarkerLayer = new t.MultiMarker({map: mapHandle!})

  if (!props.showCopyright && wrapperContainerHandle.value) {
    const re = wrapperContainerHandle.value!.querySelector('map div div div') as HTMLElement
    re.style.display = 'none'
  }

  mapHandle.on('click', ev => {
    if (!singleInfoWindow)
      singleInfoWindow = new t.InfoWindow({
        map: mapHandle!,
        position: new t.LatLng(0, 0),
        enableCustom: true,
        offset: {x: 0, y: -32}
      })
    if (!props.multiPoint) multiMarkerLayer?.remove(multiMarkerLayer?.getGeometries().map(r => r.id!))?.updateGeometries([])
    multiMarkerLayer?.add({position: ev.latLng, styleId: `style${props.styleId}`})
    multiMarkerLayer?.on('click', () => {
      if (!props.multiPoint) multiMarkerLayer?.remove(multiMarkerLayer?.getGeometries().map(r => r.id!))?.updateGeometries([])
    })
    toCenter(ev.latLng)
    if (ev.poi && !props.multiPoint) singleInfoWindow.setContent(`<div c-black>${ev.poi.name}</div>`).setPosition(ev.latLng).open()
    else singleInfoWindow.close()
  })
}

onMounted(() => {
  initTencentMapWebGlScript(props.apiKey, mapInitFn, {
    containerTag: 'map',
    libraries: ['service'],
    mapContainerId: props.containerId
  })
})

onUnmounted(() => mapHandle?.destroy())

const searchAddressCode = ref<string>('')
const searchWord = ref<string>('')
const searchResults = ref<TMap.service.SearchResult['data']>([])
const searchNearby = () => {
  if (props.serviceKey) {
    const center = mapHandle!.getCenter()
    search
      ?.searchNearby({
        center: center,
        keyword: searchWord.value,
        radius: 1000,
        servicesk: props.serviceKey
      })
      ?.then(e => {
        searchResults.value = e.data
        console.log(e.data)
      })
      ?.catch(e => {
        console.error(e)
      })
  }
}

const searchRegion = () => {
  if (props.serviceKey) {
    search
      ?.searchRegion({
        cityName: searchAddressCode.value,
        keyword: searchWord.value,
        servicesk: props.serviceKey
      })
      ?.then(e => {
        searchResults.value = e.data
        console.log(e.data)
      })
      ?.catch((e: unknown) => {
        console.error(e)
      })
  }
}
</script>

<template>
  <section relative flex-col transition-all-500>
    <map :id="props.containerId" ref="wrapperContainerHandle" flex />
    <!-- 自定义操作句柄 -->
    <nav absolute top-2 left-2 z-1000>
      <slot name="view-box" :view-mode="is3dMode" :to-2d="to2d" :to-3d="to3d">
        <VBtnGroup>
          <VBtn size="small" :disabled="is3dMode" color="primary" @click="to3d">3D</VBtn>
          <VBtn size="small" :disabled="!is3dMode" color="primary" @click="to2d">2D</VBtn>
        </VBtnGroup>
      </slot>
    </nav>

    <!-- 操作句柄 -->
    <div flex w-full min-w-full>
      <slot name="search-box">
        <div class="flex flex-row w-full">
          <ElInput v-model="searchWord" />
          <VBtn color="primary" @click="searchNearby">search</VBtn>
        </div>
        <div class="flex flex-row w-full">
          <ElInput v-model="searchAddressCode" />
          <ElInput v-model="searchWord" />
          <VBtn color="primary" @click="searchRegion">search</VBtn>
        </div>
      </slot>
    </div>
    <!-- 搜索结果 -->
    <div>
      <div v-for="(it, idx) in searchResults" :key="idx" cursor-pointer py-1 @click="toCenter(it.location, true)">
        <VChip>{{ it.title }}</VChip>
        <span>{{ it.address }}</span>
        <VChip>{{ it.ad_info.adcode }}</VChip>
        <VDivider />
      </div>
    </div>
  </section>
</template>
