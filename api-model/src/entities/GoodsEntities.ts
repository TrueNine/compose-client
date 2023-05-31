import {AnyEntity} from './BaiscEntities'
import {GoodsChangeRecordTyping, GoodsInfoTyping, GoodsTyping} from '../enums'
import {Duration} from 'moment'
import {BrandEntity} from './SiftEntities'

/**
 * 商品信息
 */
export interface GoodsInfoEntity extends AnyEntity {
  title?: string
  secondaryTitle?: string
  brandId?: string
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
  type?: GoodsTyping
  /**
   * 商品信息类型
   */
  infoType?: GoodsInfoTyping
}

/**
 * 全商品信息返回
 */
export interface AllGoodsInfoEntity extends GoodsInfoEntity {
  goodsParams?: GoodsParamsEntity[]
  detailsImages?: GoodsInfoDetailsImagesEntity[]
  goodsUnits?: GoodsUnitEntity[]
  brand?: BrandEntity
}

/**
 * 商品单位
 */
export interface GoodsUnitEntity extends AnyEntity {
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
export interface AllGoodsUnitEntity extends GoodsUnitEntity {
  extendsGoodsInfo?: GoodsInfoEntity
  info?: GoodsInfoEntity
  specifications: GoodsUnitSpecificationEntity[]
  changeRecords: GoodsUnitChangeRecordEntity[]
}

/**
 * 商品规格
 */
export interface GoodsUnitSpecificationEntity extends AnyEntity {
  specName?: string
  specValue?: string
  specCode?: string
}

/**
 * 商品参数
 */
export interface GoodsParamsEntity extends AnyEntity {
  paramName?: string
  paramValue?: string
}

/**
 * 商品详情图
 */
export interface GoodsInfoDetailsImagesEntity extends AnyEntity {
  imgId?: number
  ordered?: number
  goodsInfoId?: number
}

/**
 * 商品单位变动记录
 */
export interface GoodsUnitChangeRecordEntity extends AnyEntity {
  goodsUnitId?: number
  modifierUserId?: number
  newPrice?: number
  newTitle?: string
  oldPrice?: number
  oldTitle?: string
  changeType?: GoodsChangeRecordTyping
}

/**
 * 商品组
 */
export interface GoodsGroupEntity extends AnyEntity {
  goodsInfoId?: number
  title?: string
  doc?: string
}
