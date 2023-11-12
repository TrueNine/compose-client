import type {ITreeEntity} from '../Entities'
import type {WGS84} from '../../map'
import type {BigSerial, SerialCode} from '../Utils'

export interface Address extends ITreeEntity {
  code: string
  name: string
  level: BigSerial
  yearVersion?: SerialCode
  center?: WGS84
  leaf?: boolean
}

export interface FullAddress extends Address {}
