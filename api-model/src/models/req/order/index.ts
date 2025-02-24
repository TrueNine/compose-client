import type {ISO8601DateFormat} from '@compose/api-types'

import type {OrderStatusTyping} from '@/enums'

/**
 * # 微信小程序创建订单
 * @deprecated 已废弃
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
 * @deprecated 已废弃
 */
export interface QueryOrderReq {
  userId?: string
  customerPhone?: string
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  status?: OrderStatusTyping
  startTimeBeginDate?: ISO8601DateFormat
  startTimeAndDate?: ISO8601DateFormat
  createTimeBeginDate?: ISO8601DateFormat
  createTimeAndDate?: ISO8601DateFormat
  createTimeDesc?: boolean
  startTimeDesc?: boolean
}
