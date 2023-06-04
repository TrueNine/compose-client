/**
 * # 微信小程序拉起支付订单请求参数
 *
 * @deprecated 前端不需要调用
 */
export interface CreateMpPayOrderReq {
  amount: number
  wechatUserOpenId: string
  customOrderId: string
  title: string
  /**
   * ISO4217
   */
  currency: string
}
