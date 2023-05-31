import {AnyEntity} from './BaiscEntities'

/**
 * 品牌
 */
export interface BrandEntity extends AnyEntity {
  ordered: number
  logoImgId?: string
  title: string
  doc?: string
}

/**
 * 分类
 */
export interface CategoryEntity extends AnyEntity {
  ordered: number
  title: string
  doc?: string
}

/**
 * 所有级联品牌
 */
export interface AllCategoryEntity extends CategoryEntity {
  children?: AllCategoryEntity[]
}
