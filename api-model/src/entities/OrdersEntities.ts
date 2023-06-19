import {OrderStatusTyping, PayChannelTyping, PaymentTyping} from '../enums'
import {BaseEntity} from './BaiscEntities'

export {}

export interface Orders extends BaseEntity {
  type?: number
  orderCode?: string
  customerName?: string
  customerLandline?: string
  customerPhone?: string
  deliveryAddressDetailsId?: string
  orderRemark?: string
  requireTime?: Date
  delayedTime?: Date
  startTime?: Date
  endTime?: Date
  status?: OrderStatusTyping
  totalPrice?: number
  ordersPayRecordId?: string
}

export interface OrdersPayRecord extends BaseEntity {
  payChannelType?: PayChannelTyping
  payType?: PaymentTyping
  orderCode?: string
  payCode?: string
  refundAmount?: number
  payAmount?: number
  payMetaData?: string
  prePayCode?: string
}
