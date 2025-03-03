import { componentInstallToPlugin } from '@compose/extensions/vue'
import YFieldMessageSfc from './YFieldMessage.vue'

export interface YFieldMessageProps {
  name: string
}

export type YFieldMessageEmits = (e: 'update:name', name: string) => void

const YFieldMessage = componentInstallToPlugin(YFieldMessageSfc)

export default YFieldMessage
