import type {LocalDateTime} from '../datetime'

import type {BigSerial, Id, ReferenceId, SerialCode} from './Utils'

/**
 * 实体类基类
 */
export interface IAnyEntity {
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
