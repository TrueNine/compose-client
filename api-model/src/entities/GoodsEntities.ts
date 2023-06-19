import {BaseEntity} from './BaiscEntities'
import {GoodsChangeRecordTyping, GoodsInfoTyping, GoodsTyping} from '../enums'
import {Duration} from 'moment'
import {Brand as Brand, Category} from './SiftEntities'
import {LinkedAttachment} from './Attachment'

/**
 * 商品信息
 */
export interface GoodsInfo extends BaseEntity {
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
  type?: GoodsTyping
  /**
   * 商品信息类型
   */
  infoType?: GoodsInfoTyping
}

/**
 * 全商品信息返回
 */
export interface FullGoodsInfo extends GoodsInfo {
  goodsParams?: GoodsParams[]
  detailsImages?: FullGoodsInfoDetailsImages[]
  goodsUnits?: FullGoodsUnit[]
  brand?: Brand
  category?: Category
  bannerImg?: LinkedAttachment
}

/**
 * 商品单位
 */
export interface GoodsUnit extends BaseEntity {
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
export interface GoodsUnitSpecification extends BaseEntity {
  specName?: string
  specValue?: string
  specCode?: string
}

/**
 * 商品参数
 */
export interface GoodsParams extends BaseEntity {
  paramName?: string
  paramValue?: string
}

/**
 * 商品详情图
 */
export interface GoodsInfoDetailsImages extends BaseEntity {
  imgId?: number
  ordered?: number
  goodsInfoId?: number
}

export interface FullGoodsInfoDetailsImages extends GoodsInfoDetailsImages {
  image: LinkedAttachment
}

/**
 * 商品单位变动记录
 */
export interface GoodsUnitChangeRecord extends BaseEntity {
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
export interface GoodsGroup extends BaseEntity {
  goodsInfoId?: number
  title?: string
  doc?: string
}
