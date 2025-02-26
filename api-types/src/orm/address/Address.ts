import type { WGS84 } from '@/map'
import type { ITreeEntity } from '@/orm'
import type { i128 } from '@/typescripts'

export interface Address extends ITreeEntity {
  code: string
  name: string
  level: i128
  yearVersion?: string
  center?: WGS84
  leaf?: boolean
}
// TODO 确定其类型
export type FullAddress = Address
