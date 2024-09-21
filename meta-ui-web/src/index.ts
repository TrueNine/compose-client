import type {App} from 'vue'
import type {dynamic} from '@compose/api-types'

import YConfigProvider from './config-provider'
import YElSiderMenu from './el-sider-menu'
import YVSystemBar from './v-system-bar'
import YElSiderMenuItem from './el-sider-menu-item/index'
import YMapTencent from './map-tencent'
import YVAddressSelect from './v-address-select'
import YDebugCode from './debug-code'
import YVMenu from './v-menu'
import YVMenuItem from './v-menu-item'
import YIco from './ico'
import YForm from './form'
import YField from './field'
import YPager from './pager'

import YPreAuthorize from '@/pre-authorize'
import YConfigPreAuthorize from '@/config-pre-authorize'

export * from './pre-authorize'
export * from './config-pre-authorize'
export * from './config-provider'
export * from './el-sider-menu'
export * from './el-sider-menu-item'
export * from './map-tencent'
export * from './v-address-select'
export * from './v-system-bar'
export * from './debug-code'
export * from './form'
export * from './field'

export * from './ico'
export * from './v-menu'
export * from './v-menu-item'

export * from './common'
export * from './unplugin'
export * from './pager'

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
  YPager
}

export {
  YElSiderMenu,
  YVAddressSelect,
  YElSiderMenuItem,
  YConfigProvider,
  YMapTencent,
  YVSystemBar,
  YDebugCode,
  YVMenu,
  YVMenuItem,
  YIco,
  YPreAuthorize,
  YConfigPreAuthorize,
  YForm,
  YField,
  YPager
}

export default {
  install: (app: App) => {
    Object.entries(components).forEach((c, i) => {
      app.use(c[i] as dynamic)
    })
  }
}
