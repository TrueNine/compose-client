/**
 * # 微信小程序拉起支付订单返回参数
 */
export interface CreateMpPayOrderResp {
    random32String: string;
    iso8601Second: string;
    prePayId: `prepay_id=${string}`;
    signType: "RSA";
    paySign: string;
}
