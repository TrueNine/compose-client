import type { IEntity } from './Entities'

export interface RoleGroup extends IEntity {
  name: string
  doc?: string
}
