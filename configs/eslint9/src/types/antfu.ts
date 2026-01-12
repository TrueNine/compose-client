import type antfu from '@antfu/eslint-config'

/**
 * AntFu ESLint 配置参数类型
 * @description 从 @antfu/eslint-config 提取的配置参数类型
 */
export type AntFuConfig = NonNullable<Parameters<typeof antfu>[0]>

/**
 * TypeScript 配置选项
 * @description 用于配置 TypeScript 相关的 ESLint 规则
 */
export type AntFuTsConfig = Exclude<AntFuConfig['typescript'], boolean | undefined>

/**
 * JavaScript 配置选项
 * @description 用于配置 JavaScript 相关的 ESLint 规则
 */
export type AntFuJsConfig = Exclude<AntFuConfig['javascript'], boolean | undefined>

/**
 * Vue 配置选项
 * @description 用于配置 Vue 相关的 ESLint 规则
 */
export type AntFuVueConfig = Exclude<AntFuConfig['vue'], boolean | undefined>

/**
 * UnoCSS 配置选项
 * @description 用于配置 UnoCSS 相关的 ESLint 规则
 */
export type AntFuUnocssConfig = Exclude<AntFuConfig['unocss'], boolean | undefined>

/**
 * Stylistic 配置选项
 * @description 用于配置代码风格相关的 ESLint 规则
 */
export type AntFuStylisticConfig = Exclude<AntFuConfig['stylistic'], boolean | undefined>

/**
 * Formatter 配置选项
 * @description 用于配置格式化工具（如 Prettier）相关的选项
 */
export type AntFuFormatterConfig = Exclude<AntFuConfig['formatters'], boolean | undefined>

/**
 * Test 配置选项
 * @description 用于配置测试环境相关的 ESLint 规则
 */
export type AntFuTestConfig = Exclude<AntFuConfig['test'], boolean | undefined>

/**
 * 严格 TypeScript 配置
 * @description 启用严格类型检查的 TypeScript 配置，需要提供 tsconfig 路径
 */
export type AntFuStrictTsConfig = AntFuTsConfig & {
  /** 启用严格 TypeScript ESLint 规则 */
  strictTypescriptEslint: true
  /** tsconfig.json 文件路径 */
  tsconfigPath: string
}
