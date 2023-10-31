import type {ISO8601DateFormat} from '@compose/compose-types'

import type {OrderStatusTyping} from '../../../enums'

export {}

/**
 * # 微信小程序创建订单
 */
export interface CreateWechatSingleProductOrderReq {
  unitId: string
  wechatOpenId: string
  quantity: number
  remark?: string
  customerName?: string
  customerPhone?: string
  customerAddressDetailsId?: string
  userId?: string
}

/**
 * # 订单动态查询接口参数
 */
export interface QueryOrderReq {
  userId?: string
  customerPhone?: string
  status?: OrderStatusTyping
  startTimeBeginDate?: ISO8601DateFormat
  startTimeAndDate?: ISO8601DateFormat
  createTimeBeginDate?: ISO8601DateFormat
  createTimeAndDate?: ISO8601DateFormat
  createTimeDesc?: boolean
  startTimeDesc?: boolean
}
