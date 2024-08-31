import {Vue} from '@compose/extensions'
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

const a = Vue.componentInstallToPlugin<typeof _c>(_c, {YVMenuItem, YIco})
export default a
