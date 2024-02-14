// eslint-disable-next-line
// @ts-ignore
import elementZhCn from "element-plus/dist/locale/zh-cn";
// eslint-disable-next-line
// @ts-ignore
import elementEnUs from "element-plus/dist/locale/en";
import { dayjs } from "element-plus";
import type { SafeAny } from "@compose/api-types";

const zhCn = elementZhCn as SafeAny;
const en = elementEnUs as SafeAny;

export { zhCn as ElementPlusZhCn, en as ElementPlusEn, dayjs as ElementPlusDayjs };
