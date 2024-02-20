import type {Decimal, FullAddressDetails, IEntity, Int, ReferenceId, Timestamp} from '@compose/api-types'

import {GoodsTyping, OrderStatusTyping, PayChannelTyping, PaymentTyping} from '../enums'

import type {FullGoodsUnit} from './GoodsEntities'

export interface Orders extends IEntity {
  type?: Int
  orderCode?: string
  customerName?: string
  customerLandline?: string
  customerPhone?: string
  deliveryAddressDetailsId?: string
  orderRemark?: string
  requireTime?: Timestamp
  delayedTime?: Timestamp
  startTime?: Timestamp
  endTime?: Timestamp
  status?: OrderStatusTyping
  totalPrice?: Decimal
  ordersPayRecordId?: string
  userId?: ReferenceId
  createTime?: Timestamp
}

export interface FullOrders extends Orders {
  orderPayRecord?: OrdersPayRecord
  deliveryAddressDetails?: FullAddressDetails
  orderGoods?: FullOrdersGoods[]
}

export interface OrdersGoods extends IEntity {
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

export interface OrdersPayRecord extends IEntity {
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
