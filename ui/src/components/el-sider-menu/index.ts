import type { RouteOption } from '@truenine/types'
import type { SFCWithInstall } from '@/common/install'

import { componentInstallToPlugin } from '@/common'

import YSiderMenuItem from '../el-sider-menu-item'
import _c from './YElSiderMenu.vue'

export interface YElSiderMenuProps {
  collapsed?: boolean
  pathPrefix?: string
  routeTable: RouteOption[]
  permissions?: string[]
  roles?: string[]
  routeMode?: boolean
}

export type YElSiderMenuEmits = (e: 'update:routeTable', v: RouteOption[]) => void

const YElSiderMenu: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c, { YSiderMenuItem })
export default YElSiderMenu
