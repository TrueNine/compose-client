import type { datetime } from '@/datetime'

import type { bool, i64 } from '@/typescripts'
import type { Id, RefId } from './Utils'

/**
 * 实体类基类
 */
export interface IAnyEntity {
  readonly id?: Id
}

/**
 * 实体类基类
 */
export interface IEntity extends IAnyEntity {
  readonly crd?: datetime
  readonly mrd?: datetime
  readonly rlv?: i64
  readonly ldf?: bool
}

export interface ITreeEntity extends IEntity {
  readonly rpi?: RefId
  readonly rln?: i64
  readonly rrn?: i64
  readonly nlv?: i64
  readonly tgi?: i64
}
