import type {App} from 'vue'

import YVSystemBar from './v-system-bar'
import YElSiderMenu from './el-sider-menu'
import YElSiderMenuItem from './el-sider-menu-item/index'
import YConfigProvider from './config-provider'
import YMapTencent from './map-tencent'
import YVAddressSelect from './v-address-select'
import YQDatePicker from './q-date-picker'

const components = {YQDatePicker, YConfigProvider, YVAddressSelect, YMapTencent, YElSiderMenuItem, YElSiderMenu, YVSystemBar}
export {YQDatePicker, YElSiderMenu, YVAddressSelect, YElSiderMenuItem, YConfigProvider, YMapTencent, YVSystemBar}
export * from './common'
export default {
  install: (app: App) => {
    Object.entries(components).forEach(c => {
      app.use(c[1])
    })
  }
}
