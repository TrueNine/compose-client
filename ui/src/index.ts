import type {App, Plugin} from 'vue'

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
export {
  default as YConfigProvider,
} from './components/config-provider'
export * from './components/debug-code'
export {
  default as YDebugCode,
} from './components/debug-code'
export * from './components/el-sider-menu'
export {
  default as YElSiderMenu,
} from './components/el-sider-menu'
export * from './components/el-sider-menu-item'
export {
  default as YElSiderMenuItem,
} from './components/el-sider-menu-item/index'

export * from './components/field'
export {
  default as YField,
} from './components/field'
export * from './components/field-message'
export {
  default as YFieldMessage,
} from './components/field-message'

export * from './components/form'
export {
  default as YForm,
} from './components/form'
export * from './components/ico'

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

const plugin = {install: (app: App) => Object.entries(components).forEach(([_name, component]) => { app.use(component as Plugin<[]>) })}

export default plugin

export {
  default as YIco,
} from './components/ico'
export * from './components/pager'
export {
  default as YPager,
} from './components/pager'
export * from './components/pre-authorize'
export * from './components/v-address-select'
export {
  default as YVAddressSelect,
} from './components/v-address-select'
export * from './components/v-menu'
export {
  default as YVMenu,
} from './components/v-menu'
export * from './components/v-menu-item'
export {
  default as YVMenuItem,
} from './components/v-menu-item'
export * from './components/v-system-bar'
export {
  default as YVSystemBar,
} from './components/v-system-bar'
export * from './unplugin'

export {
  default as YConfigPreAuthorize,
} from '@/components/config-pre-authorize'
export {
  default as YPreAuthorize,
} from '@/components/pre-authorize'
