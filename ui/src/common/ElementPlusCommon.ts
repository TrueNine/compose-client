import type { dynamic } from '@compose/types'

import { dayjs } from 'element-plus'
// eslint-disable-next-line import/extensions
import elementEnUs from 'element-plus/dist/locale/en.mjs'
// eslint-disable-next-line import/extensions
import elementZhCn from 'element-plus/dist/locale/zh-cn.mjs'

const zhCn: dynamic = elementZhCn
const en: dynamic = elementEnUs

export { dayjs as ElementPlusDayjs, en as ElementPlusEn, zhCn as ElementPlusZhCn }
