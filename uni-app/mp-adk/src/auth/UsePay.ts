import { ref, type Ref } from "vue";
import type { CreateMpPayOrderResp } from "@compose/api-model";

export interface PaymentResult {
    meta?: Ref<unknown | null>;
    isSuccess?: Ref<boolean>;
}

/**
 * # 调起支付参数
 */
export type UsePayOption = CreateMpPayOrderResp;

/**
 * # 扳机式拉起支付
 * 自动获取当前平台，并拉起支付
 *
 * - 微信只能 v3 接口用
 * @see https://uniapp.dcloud.net.cn/api/plugins/payment.html
 */
export async function usePay(option: UsePayOption) {
    const isSuccess = ref<boolean>(false);
    const meta = ref<unknown | null>(null);
    const provider = (
        await uni.getProvider({
            service: "payment",
        })
    ).provider;

    const providerName = [...provider][0];
    if (!providerName) Promise.reject(new Error("你他妈在逗我？"));

    return new Promise((resolve, rej) => {
        uni.requestPayment({
            provider: providerName as "wxpay",
            nonceStr: option.random32String,
            orderInfo: {}, // TODO 此处存疑
            paySign: option.paySign, //签名，具体签名方案参见
            timeStamp: option.iso8601Second, // nonceStr	String	微信小程序必填	随机字符串，长度为32个字符以下。
            package: option.prePayId, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx
            signType: option.signType, //  签名算法，应与后台下单时的值一致
            success: (res) => {
                meta.value = res;
                isSuccess.value = true;
                resolve({
                    meta: meta.value,
                    isSuccess: isSuccess.value,
                });
            },
            fail: rej,
        });
    });
}
