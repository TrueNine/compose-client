import type { IEntity } from '@/orm/Entities'

export interface Role extends IEntity {
  name: string
  doc?: string
}
