import type {BaseEntity} from '@compose/compose-types'

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
