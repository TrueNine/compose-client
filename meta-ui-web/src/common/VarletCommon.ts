import { Locale, StyleProvider, Themes } from "@varlet/ui";
import type { BCP47 } from "@compose/api-types";

Locale.add("zh-CN", Locale.zhCN);
Locale.add("en", Locale.enUS);
Locale.add("en-US", Locale.enUS);

export function checkDark(dark: boolean) {
    const darks = Themes.dark;
    StyleProvider(dark ? null : darks);
}

export function checkLocale(b: BCP47) {
    Locale.use(b);
}
