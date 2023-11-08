import {Vue} from '@compose/api-model'
import type {RouteOption} from '@compose/compose-types'

import YSiderMenuItem from '../el-sider-menu-item'

import _c from './YElSiderMenu.vue'

export interface Props {
  collapsed?: boolean
  pathPrefix?: string
  routeTable: RouteOption[]
  permissions?: string[]
  roles?: string[]
  routeMode?: boolean
}
export interface Emits {
  (e: 'update:routeTable', v: RouteOption[]): void
}

export default Vue.componentInstallToPlugin(_c, {YSiderMenuItem})
