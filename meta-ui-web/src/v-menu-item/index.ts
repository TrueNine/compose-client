import type { dynamic, RouteOption } from '@compose/api-types'
import YIco from '@/ico/index'

import { componentInstallToPlugin } from '@compose/extensions/vue'

import _c from './YVMenuItem.vue'

export interface YVMenuItemProps {
  value?: string
  routeMode?: boolean
  route: RouteOption
  pathPrefix?: string
  parentPath?: string
  subMenu?: boolean
}

interface BaseSlotData {
  subItem: boolean
  value: string
  title: string
  hidden: boolean
}

interface IconSlotData extends BaseSlotData {
  iconName: string
}

export interface YVMenuItemSlots {
  default: () => dynamic
  icon: (data: IconSlotData) => dynamic
}

const a = componentInstallToPlugin<typeof _c>(_c, { YIco })
export default a
