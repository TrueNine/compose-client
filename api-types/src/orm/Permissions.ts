import type { IEntity } from './Entities'

export interface Permissions extends IEntity {
  name: string
  doc?: string
}
