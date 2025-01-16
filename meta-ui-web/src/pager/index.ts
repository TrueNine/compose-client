import {Vue} from '@compose/extensions'
import type {clip, i32, nil, Pq, Pr} from '@compose/api-types'

import _c from './YPager.vue'

import type {ModelValueEmits, ModelValueProps} from '@/common'

type OPr<T = unknown> = clip<Pr<T>, 'd'>

export interface YPagerProps extends ModelValueProps<Pq> {
  pr?: nil<OPr>
  maxPage?: i32
  total?: i32
}

export interface YPagerEmits extends ModelValueEmits<Pq> {
  (e: 'update:offset' | 'update:pageSize', v: i32): void
}

export default Vue.componentInstallToPlugin(_c)
