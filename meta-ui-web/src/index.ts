import type { dynamic } from '@compose/api-types'
import type { App } from 'vue'

import YConfigPreAuthorize from '@/config-pre-authorize'
import YPreAuthorize from '@/pre-authorize'
import YConfigProvider from './config-provider'
import YDebugCode from './debug-code'
import YElSiderMenu from './el-sider-menu'
import YElSiderMenuItem from './el-sider-menu-item/index'
import YField from './field'
import YFieldMessage from './field-message'
import YForm from './form'
import YIco from './ico'
import YMapTencent from './map-tencent'
import YPager from './pager'
import YVAddressSelect from './v-address-select'
import YVMenu from './v-menu'

import YVMenuItem from './v-menu-item'
import YVSystemBar from './v-system-bar'

export * from './common'
export * from './config-pre-authorize'
export * from './config-provider'
export * from './debug-code'
export * from './el-sider-menu'
export * from './el-sider-menu-item'
export * from './field'
export * from './field-message'
export * from './form'
export * from './ico'
export * from './map-tencent'
export * from './pager'

export * from './pre-authorize'
export * from './unplugin'
export * from './v-address-select'

export * from './v-menu'
export * from './v-menu-item'
export * from './v-system-bar'

const components = {
  YConfigProvider,
  YVAddressSelect,
  YMapTencent,
  YElSiderMenuItem,
  YElSiderMenu,
  YVSystemBar,
  YDebugCode,
  YVMenu,
  YVMenuItem,
  YIco,
  YPreAuthorize,
  YConfigPreAuthorize,
  YForm,
  YField,
  YFieldMessage,
  YPager,
}

export {
  YConfigPreAuthorize,
  YConfigProvider,
  YDebugCode,
  YElSiderMenu,
  YElSiderMenuItem,
  YField,
  YFieldMessage,
  YForm,
  YIco,
  YMapTencent,
  YPager,
  YPreAuthorize,
  YVAddressSelect,
  YVMenu,
  YVMenuItem,
  YVSystemBar,
}

export default {
  install: (app: App) => {
    Object.entries(components).forEach((c, i) => {
      app.use(c[i] as dynamic)
    })
  },
}
