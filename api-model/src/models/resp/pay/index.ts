/**
 * # 微信小程序拉起支付订单返回参数
 *
 * @deprecated 前端不需要调用
 */
export interface CreateMpPayOrderResp {
  random32String: string
  prePayId: string
  isIso8601Second: string
  signType: 'RSA'
  paySign: string
}
