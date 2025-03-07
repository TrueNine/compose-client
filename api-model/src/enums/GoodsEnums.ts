import type {Pair} from '@compose/api-types'

/**
 * 商品类型
 * @deprecated 已经过时老旧，等待迁移
 */
export enum GoodsTyping {
  /**
   * 实体商品
   */
  PHYSICAL_GOODS = 0,
  /**
   * 服务商品
   */
  SERVICE_GOODS = 1,
  /**
   * 虚拟商品
   */
  VIRTUAL_GOODS = 2
}

/**
 * @deprecated 已经过时老旧，等待迁移
 */
export const GoodsTypingPairs: Pair<string, number>[] = [
  {
    k: '实体商品',
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    v: GoodsTyping.PHYSICAL_GOODS.valueOf()
  },
  {
    k: '服务商品',
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    v: GoodsTyping.SERVICE_GOODS.valueOf()
  },
  {
    k: '虚拟商品',
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    v: GoodsTyping.VIRTUAL_GOODS.valueOf()
  }
]

/**
 * 商品单位更改记录
 * @deprecated 已经过时老旧，等待迁移
 */
export enum GoodsChangeRecordTyping {
  /**
   * 改价格
   */
  CHANGE_PRICE = 0,
  /**
   * 改标题
   */
  CHANGE_TITLE = 1
}

/**
 * 商品信息分类
 * @deprecated 已经过时老旧，等待迁移
 */
export enum GoodsInfoTyping {
  /**
   * 检索类型
   */
  RETRIEVAL = 0,

  /**
   * 商品单位信息
   */
  GOODS_UNIT_INFO = 1,

  /**
   * 商品单位继承信息
   */
  GOODS_UNIT_EXTEND_INFO = 2
}

/**
 * @deprecated 已经过时老旧，等待迁移
 */
export const GoodsInfoTypingPairs: Pair<string, number>[] = [
  {
    k: '检索类型',
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    v: GoodsInfoTyping.RETRIEVAL.valueOf()
  },
  {
    k: '商品单位信息',
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    v: GoodsInfoTyping.GOODS_UNIT_INFO.valueOf()
  },
  {
    k: '商品单位继承信息',
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    v: GoodsInfoTyping.GOODS_UNIT_EXTEND_INFO.valueOf()
  }
]
