import type {FullAddressDetails, IEntity} from '@compose/api-types'

import {GoodsTyping, OrderStatusTyping, PayChannelTyping, PaymentTyping} from '@/enums'

import type {FullGoodsUnit} from './GoodsEntities'
import type {decimal, i32, RefId, timestamp} from '@compose/api-types'

/**
 * @deprecated 单纯的类型定义
 */
export interface Orders extends IEntity {
  type?: i32
  orderCode?: string
  customerName?: string
  customerLandline?: string
  customerPhone?: string
  deliveryAddressDetailsId?: string
  orderRemark?: string
  requireTime?: timestamp
  delayedTime?: timestamp
  startTime?: timestamp
  endTime?: timestamp
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  status?: OrderStatusTyping
  totalPrice?: decimal
  ordersPayRecordId?: string
  userId?: RefId
  createTime?: timestamp
}

/**
 * @deprecated 单纯的类型定义
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export interface FullOrders extends Orders {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  orderPayRecord?: OrdersPayRecord
  deliveryAddressDetails?: FullAddressDetails
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  orderGoods?: FullOrdersGoods[]
}

/**
 * @deprecated 单纯的类型定义
 */
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  goodsType?: GoodsTyping
}

/**
 * @deprecated 单纯的类型定义
 */
export interface OrdersPayRecord extends IEntity {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  payChannelType?: PayChannelTyping
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  payType?: PaymentTyping
  orderCode?: string
  payCode?: string
  refundAmount?: number
  payAmount?: number
  payMetaData?: unknown
  prePayCode?: string
}

/**
 * @deprecated 单纯的类型定义
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export interface FullOrdersGoods extends OrdersGoods {
  goodsUnit?: FullGoodsUnit
}
