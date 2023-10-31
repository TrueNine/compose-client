import type {BaseEntity} from '@compose/compose-types'

/**
 * 品牌
 */
export interface Brand extends BaseEntity {
  ordered: number
  logoImgId?: string
  title: string
  doc?: string
}

/**
 * 分类
 */
export interface Category extends BaseEntity {
  ordered: number
  title: string
  doc?: string
}

/**
 * 所有级联品牌
 */
export interface FullCategory extends Category {
  children?: FullCategory[]
}
