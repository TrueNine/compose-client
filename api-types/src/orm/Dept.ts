import type { IEntity, ITreeEntity } from './Entities'
import type { RefId } from './Utils'

export interface Dept extends ITreeEntity {
  name: string
  doc?: string
}

export interface UserDept extends IEntity {
  userId: RefId
  deptId: RefId
}
