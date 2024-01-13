import type {LocalDateTime} from '../datetime'
import type {Int} from '../typescripts'

import type {BigSerial, Id, ReferenceId, SerialCode} from './Utils'

/**
 * 分页混合实体
 */
export interface PageableEntity {
  pageSize?: Int
  offset?: Int
  unPage?: boolean
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
  readonly crd?: LocalDateTime
  readonly mrd?: LocalDateTime
  readonly rlv?: BigSerial
  readonly ldf?: boolean
}

export interface ITreeEntity extends IEntity {
  readonly rpi?: ReferenceId
  readonly rln?: BigSerial
  readonly rrn?: BigSerial
  readonly nlv?: BigSerial
  readonly tgi?: SerialCode
}
