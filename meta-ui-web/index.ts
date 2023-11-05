import type {App} from 'vue'

import YVSystemBar from './v-system-bar'
import YElSiderMenu from './el-sider-menu/index'
import YElSiderMenuItem from './el-sider-menu-item/index'
import YConfigProvider from './config-provider'
import YMapTencent from './map-tencent'

const components = {YConfigProvider, YMapTencent, YElSiderMenuItem, YElSiderMenu, YVSystemBar}

export {YElSiderMenu, YElSiderMenuItem, YConfigProvider, YMapTencent, YVSystemBar}

export default {
  install: (app: App) => {
    Object.entries(components).forEach(c => {
      app.use(c[1])
    })
  }
}

export * from './common'
