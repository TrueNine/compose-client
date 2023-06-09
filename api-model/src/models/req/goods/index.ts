import {GoodsInfo, GoodsParams, GoodsUnit, GoodsUnitSpecification} from '../../../entities'
import {GoodsInfoTyping, GoodsTyping} from '../../../enums'

/**
 * 保存实体商品
 */
export interface PostUnActivatedGoodsRequestParam {
  info: GoodsInfo
  params: GoodsParams[]
  goodsUnits: PostGoodsUnitRequestParam[]
}

/**
 * 商品单位
 */
export interface PostGoodsUnitRequestParam {
  unit: GoodsUnit
  info?: GoodsInfo
  specs?: GoodsUnitSpecification[]
}

export interface GetAllGoodsInfoRequestParam {
  goodsType?: GoodsTyping
  infoType?: GoodsInfoTyping
  goodsName?: string
  categoryId?: string
  brandId?: string
}
