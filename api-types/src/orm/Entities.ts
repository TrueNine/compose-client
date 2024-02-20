import type {Id, RefId} from './Utils'

import type {bigserial, bool, int, serialcode} from '@/typescripts'
import type {datetime} from '@/datetime'

/**
 * 分页混合实体
 */
export interface PageableEntity {
  pageSize?: int
  offset?: int
  unPage?: bool
}

/**
 * 实体类基类
 */
export interface IAnyEntity extends PageableEntity {
  id?: Id
}

/**
 * 实体类基类
 */
export interface IEntity extends IAnyEntity {
  readonly crd?: datetime
  readonly mrd?: datetime
  readonly rlv?: bigserial
  readonly ldf?: bool
}

export interface ITreeEntity extends IEntity {
  readonly rpi?: RefId
  readonly rln?: bigserial
  readonly rrn?: bigserial
  readonly nlv?: bigserial
  readonly tgi?: serialcode
}
