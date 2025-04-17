import type { ModelValueEmits, ModelValueProps } from '@/common'
import type { clip, i32, nil, Pq, Pr } from '@compose/api-types'

import { componentInstallToPlugin } from '@/common'

import _c from './YPager.vue'

type OPr<T = unknown> = clip<Pr<T>, 'd'>

export interface YPagerProps extends ModelValueProps<Pq> {
  pr?: nil<OPr>
  maxPage?: i32
  total?: i32
}

export interface YPagerEmits extends ModelValueEmits<Pq> {
  'update:offset': [v: number]
  'update:pageSize': [v: number]
}

export default componentInstallToPlugin(_c)
