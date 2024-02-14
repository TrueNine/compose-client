import type { EnumCommentMap, EnumMap } from "@compose/api-types";

export enum ISO4217 {
    CNY = "CNY",
    USD = "USD",
}
export const ISO4217CommentMap: EnumCommentMap<typeof ISO4217> = {
    [ISO4217.CNY]: "人民币",
    [ISO4217.USD]: "美元",
};
export const ISO4217Map: EnumMap<typeof ISO4217> = {
    [ISO4217.CNY]: ISO4217.CNY,
    [ISO4217.USD]: ISO4217.CNY,
};
