import type {dynamic} from '@truenine/types'

import elementEnUs from 'element-plus/es/locale/lang/en'
import elementZhCn from 'element-plus/es/locale/lang/zh-cn'

const zhCn: dynamic = elementZhCn
const en: dynamic = elementEnUs

export {
  en as ElementPlusEn,
  zhCn as ElementPlusZhCn
}

export {
  dayjs as ElementPlusDayjs
} from 'element-plus'
