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
  rlv?: BigSerial
  ldf?: boolean
}

export interface ITreeEntity extends IEntity {
  rpi?: ReferenceId
  rln?: BigSerial
  rrn?: BigSerial
  nlv?: BigSerial
  tgi?: SerialCode
}
