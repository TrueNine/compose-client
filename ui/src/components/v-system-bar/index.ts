import type { bool, dynamic } from '@truenine/types'
import { componentInstallToPlugin } from '@/common'

import YIco from '@/components/ico'
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

export default componentInstallToPlugin(_c, { YIco })
