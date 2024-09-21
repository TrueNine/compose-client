import {Vue} from '@compose/extensions'
import type {InferDefaults} from '@compose/extensions'
import type {clip, i32, nil, Pq, Pr} from '@compose/api-types'
import {Pw} from '@compose/api-model'

import _c from './YPager.vue'

import type {ModelValueEmits, ModelValueProps} from '@/common'
export default Vue.componentInstallToPlugin(_c)

type OPr<T = unknown> = clip<Pr<T>, 'd'>

export interface YPagerProps extends ModelValueProps<Pq> {
  pr?: nil<OPr>
  maxPage?: i32
  total?: i32
}

export const YPagerDefaultProps: InferDefaults<YPagerProps> = {
  modelValue: () => Pw.DEFAULT_MAX,
  pr: null,
  maxPage: 6,
  total: 10
}

export interface YPagerEmits extends ModelValueEmits<Pq> {
  (e: 'update:offset', v: i32): void
  (e: 'update:pageSize', v: i32): void
}
