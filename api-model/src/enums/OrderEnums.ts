import type { Pair } from "@compose/api-types";

/**
 * 订单状态
 */
export enum OrderStatusTyping {
    PRE_PAY = 1001,
    CANCEL_PAY = 1002,
    PAID = 2001,
    CANCEL = 2002,
    REFUNDED = 2003,
    PAY_SUCCESS_BIZ_FAILED = 5002,
    COMPLETED = 2023,
    PRE_REFUND = 4001,
}

export const OrderStatusTypingPairs: Pair<string, number>[] = [
    {
        k: "预付款",
        v: OrderStatusTyping.PRE_PAY,
    },
    {
        k: "取消支付",
        v: OrderStatusTyping.CANCEL_PAY.valueOf(),
    },
    {
        k: "已付款",
        v: OrderStatusTyping.PAID.valueOf(),
    },
    {
        k: "订单已取消",
        v: OrderStatusTyping.CANCEL.valueOf(),
    },
    {
        k: "已退款",
        v: OrderStatusTyping.REFUNDED.valueOf(),
    },
    {
        k: "订单已完成",
        v: OrderStatusTyping.COMPLETED.valueOf(),
    },
    {
        k: "预退款",
        v: OrderStatusTyping.PRE_REFUND.valueOf(),
    },
    {
        k: "支付成功，业务处理失败",
        v: OrderStatusTyping.PAY_SUCCESS_BIZ_FAILED.valueOf(),
    },
];

/**
 * 支付渠道枚举
 */
export enum PayChannelTyping {
    WECHAT = 0,
    ALIPAY = 1,
}

export const PayChannelTypingPairs: Pair<string, number>[] = [
    {
        k: "微信支付",
        v: PayChannelTyping.WECHAT.valueOf(),
    },
    {
        k: "支付宝",
        v: PayChannelTyping.ALIPAY.valueOf(),
    },
];

/**
 * 支付流转类型
 */
export enum PaymentTyping {
    PRE_PAY = 1001,
    PAID = 2001,
    PRE_REFUND = 4001,
    PAY_SUCCESS__BIZ_FAILED = 5002,
    REFUNDED = 2002,
}

export const PaymentTypingPairs: Pair<string, number>[] = [
    {
        k: "预付款",
        v: PaymentTyping.PRE_PAY.valueOf(),
    },
    {
        k: "已付款",
        v: PaymentTyping.PAID.valueOf(),
    },
    {
        k: "预退款",
        v: PaymentTyping.PRE_REFUND.valueOf(),
    },
    {
        k: "已退款",
        v: PaymentTyping.REFUNDED.valueOf(),
    },
    {
        k: "支付成功，业务异常",
        v: PaymentTyping.PAY_SUCCESS__BIZ_FAILED.valueOf(),
    },
];
