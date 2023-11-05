<script lang="ts" setup>
import {BasicMapZoomType, initTencentMapWebGlScript, LazyGetMapZoomType} from '@compose/tmap'
import type {TMap} from 'compose-tmap'

import {type Props} from './index'
const mapDefaultContainerId: string = 'YMapTencent_Container_Wrapper'

defineOptions({
  name: 'YMapTencent'
})

const wrapperContainerHandle = ref<HTMLElement | null>(null)

let lazyTMap: typeof TMap | null = null
let mapHandle: TMap.Map | null = null
let multiMarkerLayer: TMap.MultiMarker | null = null
let singleInfoWindow: TMap.InfoWindow | null = null

const props = withDefaults(defineProps<Props>(), {
  containerId: mapDefaultContainerId,
  viewMode: '3D',
  serviceKey: undefined,
  zoom: 13,
  multiPoint: false,
  styleId: undefined,
  doubleClickZoom: true,
  controlBtn: false,
  showCopyright: false,
  initCenter: () => ({lat: 0, lng: 0}) as TMap.LatLng,
  mapZoomType: () => BasicMapZoomType.DEFAULT
})

const to2d = () => mapHandle?.setViewMode('2D')
const to3d = () => mapHandle?.setViewMode('3D').setPitch(55)
const toCenter = (latLng: TMap.LatLngDataTyping) => mapHandle?.panTo(latLng)

const mapInitFn = (_: HTMLElement, t: typeof TMap) => {
  lazyTMap = t
  mapHandle = new t.Map(wrapperContainerHandle.value!, {
    center: props.initCenter,
    viewMode: props.viewMode,
    mapStyleId: props.styleId,
    doubleClickZoom: props.doubleClickZoom,
    showControl: props.controlBtn,
    mapZoomType: LazyGetMapZoomType.getTencentMapZoomType(props.mapZoomType!),
    rotation: 0
  })
  multiMarkerLayer = new t.MultiMarker({map: mapHandle!})

  if (!props.showCopyright && wrapperContainerHandle.value) {
    const re = wrapperContainerHandle.value!.querySelector('div div div div div div') as HTMLElement
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
    multiMarkerLayer?.add({position: ev.latLng, styleId: props.styleId})
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

const searchWord = ref<string>('')
const searchResults = ref<TMap.service.SearchResult['data']>([])
const search = () => {
  if (props.serviceKey) {
    const b = new lazyTMap!.service.Search({
      pageSize: 10
    })
    const center = mapHandle!.getCenter()
    console.log(b)
    b.searchNearby({
      center: center,
      keyword: searchWord.value,
      radius: 1000,
      servicesk: props.serviceKey
    })
      .then(e => {
        searchResults.value = e.data
        console.log(e.data)
      })
      .catch(e => {
        console.error(e)
      })
    console.log(b)
  }
}
</script>

<template>
  <nav flex flex-col items-center>
    <section :id="props.containerId" ref="wrapperContainerHandle" wh-full />
    <!-- 操作句柄 -->
    <div wh-full p-2 border-box flex>
      <slot name="view-box">
        <ElButtonGroup flex flex-row>
          <ElButton type="primary" @click="to3d">3D</ElButton>
          <ElButton type="primary" @click="to2d">2D</ElButton>
        </ElButtonGroup>
      </slot>
      <div class="w-full pl-2">
        <slot name="search-box">
          <div class="flex flex-row">
            <ElButtonGroup class="flex flex-row w-full">
              <ElInput v-model="searchWord" />
              <ElButton type="primary" @click="search">search</ElButton>
            </ElButtonGroup>
          </div>
          <!-- 搜索 -->
          <div v-for="(it, idx) in searchResults" :key="idx" @click="toCenter(it.location)">
            <span>{{ it.address }}</span>
            <span>{{ it.title }}</span>
          </div>
        </slot>
      </div>
    </div>
  </nav>
</template>
