/**
 * # 小程序登录返回（标准接口）
 */
export interface JsCodeToSessionResp {
    sessionKey: string;
    unionId?: string;
    openId: string;
    errorMessage?: string;
    errorCode?: number;
}
