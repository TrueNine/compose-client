import type { ScssVariableDefs, ThemeDef } from "./Def";
import { parseScssVariables } from "./resolve";

export const UniAppScss = `
$uni-color-primary: #2196F3;
$uni-color-success: #4CAF50;
$uni-color-warning: #FFC107;
$uni-color-error: #FF5722;`;

export function fillUniScss(): ScssVariableDefs {
    const defaultScss = parseScssVariables(UniAppScss);
    return {
        ...defaultScss,
    };
}

export const vkUviewScss = `
$u-type-primary: #2196F3;
$u-type-primary-disabled: #64B5F6;
$u-type-primary-dark: #1565C0;

$u-type-warning: #ef6c00;
$u-type-warning-disabled: #f57c00;
$u-type-warning-dark: #e65100;

$u-type-success: #4CAF50;
$u-type-success-disabled: #81C784;
$u-type-success-dark: #388E3C;

$u-type-error: #c62828;
$u-type-error-disabled: #d32f2f;
$u-type-error-dark: #b71c1c;`;

export function fillVkUview(theme?: ThemeDef): ScssVariableDefs {
    const defaultScss = parseScssVariables(vkUviewScss);
    if (theme?.primaryColor) defaultScss["$u-type-primary"] = `${theme.primaryColor};`;
    if (theme?.primaryColorDark) defaultScss["$u-type-primary-dark"] = `${theme.primaryColorDark};`;
    if (theme?.primaryColorDark) defaultScss["$u-type-primary-disabled"] = `${theme.primaryColorDisabled};`;
    return defaultScss;
}

export const vkUviewImport = `@import 'vk-uview-ui/theme.scss';`;
