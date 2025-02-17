import type {Duration} from 'moment'
import type {IEntity, LinkedAttachment} from '@compose/api-types'

import {GoodsChangeRecordTyping, GoodsInfoTyping, GoodsTyping} from '../enums'

import type {Brand, Category} from './SiftEntities'

/**
 * 商品信息
 */
export interface GoodsInfo extends IEntity {
  title?: string
  secondaryTitle?: string
  brandId?: string
  bannerImgId?: string
  categoryId?: string
  weightG?: number
  unit?: string
  costPrice?: number
  sellingPrice?: number
  limitSelling?: number
  miniSelling?: number
  serviceDurationTime?: Duration
  providerPayloadItems?: string[]
  customerReadyItems?: string[]
  lostPrice?: number
  distributionPercent?: number
  givePoints?: number
  maxSellingPoints?: number
  goodsInfoCode?: string
  /**
   * 商品类型
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type?: GoodsTyping
  /**
   * 商品信息类型
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  infoType?: GoodsInfoTyping
}

/**
 * 全商品信息返回
 */
export interface FullGoodsInfo extends GoodsInfo {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  goodsParams?: GoodsParams[]
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  detailsImages?: FullGoodsInfoDetailsImages[]
  goodsUnits?: FullGoodsUnit[]
  brand?: Brand
  category?: Category
  bannerImg?: LinkedAttachment
}

/**
 * 商品单位
 */
export interface GoodsUnit extends IEntity {
  extendsGoodsInfoId?: string
  goodsInfoId?: string
  forever?: boolean
  quantity?: number
  activated?: boolean
  goodsCode?: string
}

/**
 * 全部商品单位信息
 */
export interface FullGoodsUnit extends GoodsUnit {
  extendsGoodsInfo?: GoodsInfo
  info?: GoodsInfo
  specifications: GoodsUnitSpecification[]
}

/**
 * 商品规格
 */
export interface GoodsUnitSpecification extends IEntity {
  specName?: string
  specValue?: string
  specCode?: string
}

/**
 * 商品参数
 * @deprecated 单纯的类型定义
 */
export interface GoodsParams extends IEntity {
  paramName?: string
  paramValue?: string
}

/**
 * 商品详情图
 * @deprecated 单纯的类型定义
 */
export interface GoodsInfoDetailsImages extends IEntity {
  imgId?: number
  ordered?: number
  goodsInfoId?: number
}

/**
 * @deprecated 单纯的类型定义
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export interface FullGoodsInfoDetailsImages extends GoodsInfoDetailsImages {
  image: LinkedAttachment
}

/**
 * 商品单位变动记录
 * @deprecated 暂未使用
 */
export interface GoodsUnitChangeRecord extends IEntity {
  goodsUnitId?: number
  modifierUserId?: number
  newPrice?: number
  newTitle?: string
  oldPrice?: number
  oldTitle?: string
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  changeType?: GoodsChangeRecordTyping
}

/**
 * 商品组
 */
export interface GoodsGroup extends IEntity {
  goodsInfoId?: number
  title?: string
  doc?: string
}
