import type { dynamic, RouteOption } from '@compose/types'
import { componentInstallToPlugin } from '@/common'

import YIco from '@/components/ico/index'

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

export default componentInstallToPlugin<typeof _c>(_c, { YIco })
