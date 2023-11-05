import {Vue} from '@compose/api-model'
import type {RouteOption} from '@compose/compose-types'

import YSiderMenuItem from '../sider-menu-item'

import _c from './YSiderMenu.vue'

export interface Props {
  collapsed?: boolean
  routeTable: RouteOption[]
  permissions: string[]
  roles: string[]
}

export default Vue.componentInstallToPlugin(_c, {YSiderMenuItem})
