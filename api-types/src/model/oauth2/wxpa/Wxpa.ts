import type { TypeInt } from "@/orm";
import type { timestamp } from "@/datetime";
import type { bigtext, bool } from "@/typescripts";

export interface BaseWxpaResp {
    errorCode?: TypeInt;
    errorMessage?: string;
    expireInSecond?: timestamp;
    isError?: bool;
}

export interface WxpaVerifyModel {
    signature?: bigtext;
    timestamp?: timestamp;
    nonce?: string;
    echostr?: string;
}

export interface WxpaGetAccessTokenResp extends BaseWxpaResp {
    accessToken?: string;
}

export interface WxpaGetTicketResp extends BaseWxpaResp {
    ticket?: string;
}

export interface WxpaSignatureResp {
    appId?: string;
    nonceString?: string;
    timestamp?: timestamp;
    url?: string;
    sign?: string;
}
