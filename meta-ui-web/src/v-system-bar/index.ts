import {Vue} from '@compose/api-model'
import type {bool, dynamic} from '@compose/api-types'

import _c from './YVSystemBar.vue'

import YIco from '@/ico'

export interface YSystemBarProps {
  showAppBar?: bool
  menuOpened?: bool
  settingsMenuOpened?: bool
}
export interface YVSystemBarEmits {
  (e: 'update:menuOpened', v: bool): void
  (e: 'update:settingsMenuOpened', v: bool): void
}

export interface YVSystemBarSlots {
  default: () => dynamic
  'app-title': () => dynamic
  'app-settings': () => dynamic
  'left-btn': () => dynamic
  'right-btn': () => dynamic
  drawer: (p: {menuOpened: bool}) => dynamic
  'settings-drawer': (p: {settingsMenuOpened: bool}) => dynamic
}

const a = Vue.componentInstallToPlugin(_c, {YIco})
export default a
