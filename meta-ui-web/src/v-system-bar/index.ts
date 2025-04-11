import type { bool, dynamic } from '@compose/api-types'
import YIco from '@/ico'

import { componentInstallToPlugin } from '@/common'

import _c from './YVSystemBar.vue'

export interface YSystemBarProps {
  showAppBar?: bool
  menuOpened?: bool
  progress?: number
  progressLoading?: bool
  progressColor?: string
  settingsMenuOpened?: bool
}

export interface YVSystemBarEmits {
  (e: 'update:settingsMenuOpened' | 'update:progressLoading' | 'update:menuOpened', v: bool): void

  (e: 'update:progress', v: number): void

  (e: 'update:progressColor', v: string): void
}

export interface YVSystemBarSlots {
  'default': () => dynamic
  'app-title': () => dynamic
  'app-settings': () => dynamic
  'left-btn': () => dynamic
  'right-btn': () => dynamic
  'drawer': (p: { menuOpened: bool }) => dynamic
  'settings-drawer': (p: { settingsMenuOpened: bool }) => dynamic
}

const a = componentInstallToPlugin(_c, { YIco })
export default a
