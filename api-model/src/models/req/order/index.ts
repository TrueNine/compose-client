export {}

/**
 * # 创建订单
 */
export interface CreateWechatSingleProductOrderReq {
  unitId: string
  wechatOpenId: string
  quantity: number
  remark?: string
  customerName?: string
  customerPhone?: string
  customerAddressDetailsId?: string
}
