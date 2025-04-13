import type { dynamic } from '@compose/api-types'

import { dayjs } from 'element-plus'
// eslint-disable-next-line import/extensions
import elementEnUs from 'element-plus/dist/locale/en.mjs'
// eslint-disable-next-line import/extensions
import elementZhCn from 'element-plus/dist/locale/zh-cn.mjs'

// eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-member-access
const zhCn: dynamic = elementZhCn.default
// eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-member-access
const en: dynamic = elementEnUs.default

export { dayjs as ElementPlusDayjs, en as ElementPlusEn, zhCn as ElementPlusZhCn }
