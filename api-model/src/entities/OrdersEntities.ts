import type {ISO8601DatetimeFormat} from '../defineds'
import {GoodsTyping, OrderStatusTyping, PayChannelTyping, PaymentTyping} from '../enums'

import type {FullAddressDetails} from './Address'
import type {BaseEntity} from './BaiscEntities'
import type {FullGoodsUnit} from './GoodsEntities'

export interface Orders extends BaseEntity {
  type?: number
  orderCode?: string
  customerName?: string
  customerLandline?: string
  customerPhone?: string
  deliveryAddressDetailsId?: string
  orderRemark?: string
  requireTime?: ISO8601DatetimeFormat
  delayedTime?: ISO8601DatetimeFormat
  startTime?: ISO8601DatetimeFormat
  endTime?: ISO8601DatetimeFormat
  status?: OrderStatusTyping
  totalPrice?: number
  ordersPayRecordId?: string
  userId?: string
  createTime?: ISO8601DatetimeFormat
}

export interface FullOrders extends Orders {
  orderPayRecord?: OrdersPayRecord
  deliveryAddressDetails?: FullAddressDetails
  orderGoods?: FullOrdersGoods[]
}

export interface OrdersGoods extends BaseEntity {
  subtotal?: number
  quantity?: number
  goodsGroupOldPrice?: number
  goodsGroupOldTitle?: string
  goodsGroupId?: string
  deliveryTotalWeightG?: number
  deliveryOldTitle?: string
  deliveryId?: string
  providerOldPhone?: string
  providerOldTitle?: string
  providerId?: string
  goodsUnitOldPrice?: number
  goodsUnitOldTitle?: string
  goodsWeightG?: number
  goodsUnitId?: string
  ordersId?: string
  goodsType?: GoodsTyping
}

export interface OrdersPayRecord extends BaseEntity {
  payChannelType?: PayChannelTyping
  payType?: PaymentTyping
  orderCode?: string
  payCode?: string
  refundAmount?: number
  payAmount?: number
  payMetaData?: unknown
  prePayCode?: string
}

export interface FullOrdersGoods extends OrdersGoods {
  goodsUnit?: FullGoodsUnit
}
