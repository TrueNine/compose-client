import type {App} from 'vue'

import YSiderMenu from './sider-menu/index'
import YSiderMenuItem from './sider-menu-item/index'
import YConfigProvider from './config-provider'
import YMapTencent from './map-tencent'

const components = [YConfigProvider, YMapTencent, YSiderMenuItem, YSiderMenu]
export {YSiderMenu, YSiderMenuItem, YConfigProvider, YMapTencent}

export default {
  install: (app: App) => {
    components.forEach(app.use)
  }
}

export * from './common'
