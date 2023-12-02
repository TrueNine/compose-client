import type {App} from 'vue'

import YConfigProvider from './config-provider'
import YElSiderMenu from './el-sider-menu'
import YVSystemBar from './v-system-bar'
import YElSiderMenuItem from './el-sider-menu-item/index'
import YMapTencent from './map-tencent'
import YVAddressSelect from './v-address-select'

export * from './config-provider'
export * from './el-sider-menu'
export * from './el-sider-menu-item'
export * from './map-tencent'
export * from './v-address-select'
export * from './v-system-bar'

export * from './common'

const components = {YConfigProvider, YVAddressSelect, YMapTencent, YElSiderMenuItem, YElSiderMenu, YVSystemBar}
export {YElSiderMenu, YVAddressSelect, YElSiderMenuItem, YConfigProvider, YMapTencent, YVSystemBar}

export default {
  install: (app: App) => {
    Object.entries(components).forEach(c => {
      app.use(c[1])
    })
  }
}
