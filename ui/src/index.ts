import type { App, Plugin } from 'vue'

import YConfigPreAuthorize from '@/components/config-pre-authorize'
import YPreAuthorize from '@/components/pre-authorize'
import YConfigProvider from './components/config-provider'
import YDebugCode from './components/debug-code'
import YElSiderMenu from './components/el-sider-menu'
import YElSiderMenuItem from './components/el-sider-menu-item/index'
import YField from './components/field'
import YFieldMessage from './components/field-message'
import YForm from './components/form'
import YIco from './components/ico'
import YPager from './components/pager'
import YVAddressSelect from './components/v-address-select'
import YVMenu from './components/v-menu'

import YVMenuItem from './components/v-menu-item'
import YVSystemBar from './components/v-system-bar'

export * from './common'
export * from './components/config-pre-authorize'
export * from './components/config-provider'
export * from './components/debug-code'
export * from './components/el-sider-menu'
export * from './components/el-sider-menu-item'
export * from './components/field'
export * from './components/field-message'
export * from './components/form'
export * from './components/ico'

export * from './components/pager'
export * from './components/pre-authorize'
export * from './components/v-address-select'
export * from './components/v-menu'

export * from './components/v-menu-item'
export * from './components/v-system-bar'
export * from './unplugin'

const components = {
  YConfigProvider,
  YVAddressSelect,
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
} as Record<string, unknown>

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
  YPager,
  YPreAuthorize,
  YVAddressSelect,
  YVMenu,
  YVMenuItem,
  YVSystemBar,
}

const plugin = {
  install: (app: App): void => {
    Object.entries(components).forEach(([_name, component]) => {
      app.use(component as Plugin<[]>)
    })
  },
}

export default plugin
