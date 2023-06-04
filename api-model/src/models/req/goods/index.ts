import {GoodsInfoEntity, GoodsParamsEntity, GoodsUnitEntity, GoodsUnitSpecificationEntity} from '../../../entities'
import {GoodsInfoTyping, GoodsTyping} from '../../../enums'

/**
 * 保存实体商品
 */
export interface PostUnActivatedGoodsRequestParam {
  info: GoodsInfoEntity
  params: GoodsParamsEntity[]
  goodsUnits: PostGoodsUnitRequestParam[]
}

/**
 * 商品单位
 */
export interface PostGoodsUnitRequestParam {
  unit: GoodsUnitEntity
  info?: GoodsInfoEntity
  specs?: GoodsUnitSpecificationEntity[]
}

export interface GetAllGoodsInfoRequestParam {
  goodsType?: GoodsTyping
  infoType?: GoodsInfoTyping
  goodsName?: string
  categoryId?: string
  brandId?: string
}
