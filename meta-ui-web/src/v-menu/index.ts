import {componentInstallToPlugin} from '@compose/extensions/vue'
import type {RouteOption} from '@compose/api-types'

import _c from './YVMenu.vue'

import YIco from '@/ico'
import YVMenuItem from '@/v-menu-item/YVMenuItem.vue'

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

const a = componentInstallToPlugin(_c, {YVMenuItem, YIco})
export default a
