import type { BaseSuccessOption, JsApiListMap } from "../common";

export interface CheckJsApiOption extends BaseSuccessOption {
    jsApiList: (keyof JsApiListMap)[];
}
