import type { KPair } from "@compose/api-types";

import { GoodsInfoTyping, GoodsTyping } from "../../../enums";
import type { GoodsInfo, GoodsParams, GoodsUnit, GoodsUnitSpecification } from "../../../entities";

/**
 * 保存实体商品
 */
export interface PostUnActivatedGoodsReq {
    info: GoodsInfo;
    bannerImgId?: string;
    params: GoodsParams[];
    /**
     * 所有详情图片
     */
    images?: KPair<string, number>[];
    goodsUnits: PostGoodsUnitReq[];
}

/**
 * 商品单位
 */
export interface PostGoodsUnitReq {
    unit: GoodsUnit;
    info?: GoodsInfo;
    specs?: GoodsUnitSpecification[];
}

export interface GetAllGoodsInfoReq {
    goodsType?: GoodsTyping;
    infoType?: GoodsInfoTyping;
    goodsName?: string;
    categoryId?: string;
    brandId?: string;
}

/**
 * # 商品单位修改参数
 */
export interface ModifyGoodsUnitReq {
    goodsUnit: GoodsUnit;
    unitInfo?: GoodsInfo;
}
