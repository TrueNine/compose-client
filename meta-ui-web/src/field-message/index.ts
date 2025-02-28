import type { ModelValueEmits, ModelValueProps } from '@/common/VuePropsCommon'

import { componentInstallToPlugin } from '@compose/extensions/vue'
import YFieldMessageSfc from './YFieldMessage.vue'

export interface YFieldMessageProps extends ModelValueProps<string[]> {
  name: string | string[]
}

export type YFieldMessageEmits = ModelValueEmits<string[]>

const YFieldMessage = componentInstallToPlugin(YFieldMessageSfc)

export default YFieldMessage
