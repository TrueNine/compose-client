import { componentInstallToPlugin } from '@/common'

import YFieldMessageSfc from './YFieldMessage.vue'

export interface YFieldMessageProps {
  name: string
}

export type YFieldMessageEmits = (e: 'update:name', name: string) => void

export default componentInstallToPlugin(YFieldMessageSfc)
