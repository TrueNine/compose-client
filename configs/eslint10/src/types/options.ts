import type {AntFuConfig, AntFuStrictTsConfig, AntFuTsConfig} from './antfu'

/**
 * defineConfig 函数的配置选项
 * @description 扩展 AntFuConfig，允许用户传递 antfu() 支持的任何选项，同时为常用选项提供合理的默认值
 */
export interface ConfigOptions extends Omit<AntFuConfig, 'typescript'> {
  typescript?: boolean | AntFuStrictTsConfig | AntFuTsConfig
  /** Enable uniapp-specific Vue casing rules. */
  uniapp?: boolean
}
