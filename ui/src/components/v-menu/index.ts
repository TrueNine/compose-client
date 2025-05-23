import type { RouteOption } from '@compose/types'
import { componentInstallToPlugin } from '@/common'

import YIco from '@/components/ico'

import YVMenuItem from '../v-menu-item/YVMenuItem.vue'
import _c from './YVMenu.vue'

export interface YVMenuProps {
  value?: string
  railWidth?: string | number
  pathPrefix?: string
  opened?: boolean
  routeMode?: boolean
  routes?: RouteOption[]
}
export interface YVMenuEmits {
  (e: 'update:value', value: string): void
  (e: 'update:routes', routes: RouteOption[]): void
  (e: 'update:opened', opened: boolean): void
}

export default componentInstallToPlugin(_c, { YVMenuItem, YIco })
