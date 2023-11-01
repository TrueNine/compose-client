<script lang="ts" setup>
import {BasicMapZoomType, initTencentMapWebGlScript, LazyGetMapZoomType} from '@compose/tmap'
import type {TMap} from 'compose-tmap'

import type {Props} from './index'

const wrapperContainerHandle = ref<HTMLElement | null>(null)
let lazyTMap: typeof TMap | null = null
let mapHandle: TMap.Map | null = null
let multiMarkerLayer: TMap.MultiMarker | null = null
let singleInfoWindow: TMap.InfoWindow | null = null

const props = withDefaults(defineProps<Props>(), {
  containerId: 'YMapTencent_Container_Wrapper',
  viewMode: '2D',
  zoom: 13,
  multiPoint: false,
  styleId: undefined,
  doubleClickZoom: true,
  controlBtn: false,
  showCopyright: false,
  initCenter: () => {
    return {
      lat: 0,
      lng: 0
    } as TMap.LatLng
  },
  mapZoomType: () => BasicMapZoomType.DEFAULT
})

defineOptions({
  name: 'YMapTencent'
})

const mapInitFn = (container: HTMLElement, t: typeof TMap) => {
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

  if (!props.showCopyright && wrapperContainerHandle.value) {
    const re = wrapperContainerHandle.value!.querySelector('div div div div div div') as HTMLElement
    re.style.display = 'none'
  }

  multiMarkerLayer = new t.MultiMarker({
    map: mapHandle!
  })

  mapHandle.on('click', ev => {
    console.log(ev)

    if (!singleInfoWindow)
      singleInfoWindow = new t.InfoWindow({
        map: mapHandle!,
        position: new t.LatLng(0, 0),
        offset: {x: 0, y: -32}
      })
    if (!props.multiPoint) multiMarkerLayer?.remove(multiMarkerLayer?.getGeometries().map(r => r.id!))?.updateGeometries([])
    multiMarkerLayer?.add({
      position: ev.latLng,
      styleId: props.styleId
    })
    mapHandle?.panTo(ev.latLng)
    if (ev.poi && !props.multiPoint) singleInfoWindow.setContent(ev.poi.name).setPosition(ev.latLng).open()
    else singleInfoWindow.close()
  })
}

onMounted(() => {
  initTencentMapWebGlScript(props.apiKey, mapInitFn, {
    containerTag: 'section',
    libraries: ['service'],
    mapContainerId: props.containerId
  })
})

onUnmounted(() => {
  mapHandle?.destroy()
})

function to2d() {
  mapHandle?.setViewMode('2D')
}

function to3d() {
  mapHandle?.setViewMode('3D')
  mapHandle?.setPitch(55)
}

const searchWord = ref<string>('')
const a = () => {
  console.log(lazyTMap)
  const b = new lazyTMap!.service.Search({
    pageSize: 10
  })
  console.log(b)
  b.searchNearby({
    center: new window.TMap.LatLng(43.99753168905096, 88.06493709486676),
    keyword: '医院',
    radius: 1000,
    servicesk: 'FXE9aQAFkeaHmzdYdue9THN5lmycBN6'
  })
    .then(console.log)
    .catch(console.error)
  console.log(b)
}
</script>

<template>
  <nav class="flex flex-col items-center">
    <section :id="containerId" ref="wrapperContainerHandle" class="w-full h-full" />
    <div class="w-full h-full p-2 border-box flex">
      <slot name="viewBox">
        <ElButtonGroup class="flex flex-row">
          <ElButton type="primary" @click="to3d">3D</ElButton>
          <ElButton type="primary" @click="to2d">2D</ElButton>
        </ElButtonGroup>
      </slot>
      <div class="w-full pl-2">
        <slot name="searchBox">
          <div class="flex flex-row">
            <ElButtonGroup class="flex flex-row w-full">
              <ElInput v-model="searchWord" />
              <ElButton>搜索</ElButton>
            </ElButtonGroup>
          </div>
        </slot>
      </div>
    </div>
    <ElButton type="primary" @click="a">search</ElButton>
  </nav>
</template>
