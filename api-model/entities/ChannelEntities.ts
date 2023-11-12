import type {IEntity} from '@compose/compose-types'

import {GoodsTyping} from '../enums/GoodsEnums'

/**
 * 渠道全局配
 */
export interface ChannelGlobalConfig extends IEntity {
  allowMirrorPenetration?: string
}

/**
 * 渠道
 */
export interface Channels extends IEntity {
  pid?: string
  leadId?: string
  brandId?: string
  title: string
  phone?: string
  addressDetailsId?: string
  leaderUserId?: string
  liveImgId?: string
}

/**
 * 渠道商品组镜像
 */
export interface ChannelMirrorGoods extends IEntity {
  channelId: string
  mirrorType: number
  goodsType: GoodsTyping
  goodsGroupId?: number
  goodsUnitId?: number
  goodsGroupFixedCommission?: number
  goodsGroupPercent?: number
  goodsUnitFixedCommission?: number
  goodsUnitPercent?: number
  /**
   * 可向上浮动百分比
   */
  upPercent?: number
  /**
   * 向上浮动固定价格
   */
  upFixedPrice?: number
  /**
   * 向下浮动百分比
   */
  downPercent?: number
  /**
   * 向下浮动固定价格
   */
  downFixedPrice?: number
}

/**
 * 渠道结算记录
 */
export interface ChannelCommissionRecord extends IEntity {
  ordersId?: string
  ordersGoodsId?: string
  goodsUnitOldTitle?: string
  goodsUnitOldPrice?: number
  ordersGoodsOldPrice?: number
  /**
   * 应得分成
   */
  commission?: number
  endpointId?: string
  endpointUserId?: string
}
