import type {KPair} from '@compose/api-types'

import {GoodsInfoTyping, GoodsTyping} from '@/enums'
import type {GoodsInfo, GoodsParams, GoodsUnit, GoodsUnitSpecification} from '../../../entities'

/**
 * 保存实体商品
 * @deprecated 暂未使用
 */
export interface PostUnActivatedGoodsReq {
  info: GoodsInfo
  bannerImgId?: string
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  params: GoodsParams[]
  /**
   * 所有详情图片
   */
  images?: KPair<string, number>[]
  goodsUnits: PostGoodsUnitReq[]
}

/**
 * 商品单位
 */
export interface PostGoodsUnitReq {
  unit: GoodsUnit
  info?: GoodsInfo
  specs?: GoodsUnitSpecification[]
}

/**
 * @deprecated 单纯类型定义
 */
export interface GetAllGoodsInfoReq {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  goodsType?: GoodsTyping
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  infoType?: GoodsInfoTyping
  goodsName?: string
  categoryId?: string
  brandId?: string
}

/**
 * # 商品单位修改参数
 * @deprecated 暂未使用
 */
export interface ModifyGoodsUnitReq {
  goodsUnit: GoodsUnit
  unitInfo?: GoodsInfo
}
