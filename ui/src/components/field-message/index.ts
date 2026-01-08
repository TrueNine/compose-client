import type {SFCWithInstall} from '@/common/install'
import {componentInstallToPlugin} from '@/common'

import YFieldMessageSfc from './YFieldMessage.vue'

export interface YFieldMessageProps {
  name: string
}

export type YFieldMessageEmits = (e: 'update:name', name: string) => void

const YFieldMessage: SFCWithInstall<typeof YFieldMessageSfc> = componentInstallToPlugin(YFieldMessageSfc)
export default YFieldMessage
