import type {BaseEntity} from './BaiscEntities'

export {}

export interface RoleGroup extends BaseEntity {
  name: string
  doc?: string
  roles: Role[]
}

export interface Role {
  name: string
  doc?: string
  permissions: Permissions[]
}

export interface Permissions extends BaseEntity {
  name: string
  doc?: string
}
