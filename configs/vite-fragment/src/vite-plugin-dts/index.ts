import type { Plugin } from 'vite'
import type { PluginOptions } from 'vite-plugin-dts'
import dtsPluginImport from 'vite-plugin-dts'

const dtsPlugin = (dtsPluginImport as unknown as { default: typeof dtsPluginImport }).default ?? dtsPluginImport

export interface SimpleDtsOptions {
  /**
   * 入口文件路径,默认为 ['src/index.ts']
   */
  entry?: string[]
  /**
   * tsconfig 路径,默认为 'tsconfig.json'
   */
  tsconfigPath?: string
  /**
   * 源码根目录,默认为 'src'
   */
  entryRoot?: string
  /**
   * 输出目录,默认为 'dist'
   */
  outDir?: string
  /**
   * 排除的文件模式
   */
  excludes?: string[]
  /**
   * 是否生成 sourcemap,默认 false
   */
  sourcemap?: boolean
  /**
   * 是否启用严格模式,默认 true
   */
  strict?: boolean
  /**
   * 日志级别,默认 'error'
   */
  logLevel?: 'info' | 'warn' | 'error'
}

const DEFAULT_OPTIONS: Required<SimpleDtsOptions> = {
  tsconfigPath: 'tsconfig.json',
  entry: ['index.ts'],
  entryRoot: 'src',
  outDir: 'dist',
  excludes: [],
  sourcemap: false,
  strict: true,
  logLevel: 'info',
}

/**
 * 创建简化版的 DTS 插件
 */
export function createDtsPlugin(options: SimpleDtsOptions = {}): Plugin {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options }

  // 收集所有入口文件的后缀
  const extensions = new Set(
    finalOptions.entry.map((entry) => {
      const match = entry.match(/\.([^.]+)$/)
      return match ? match[1] : 'ts'
    }),
  )

  // 生成包含所有后缀的 glob 模式
  const includes = Array.from(extensions).map((ext) =>
    `${finalOptions.entryRoot}/**/*.${ext}`,
  )

  const dtsPluginConfig: PluginOptions = {
    // 基础配置
    entryRoot: finalOptions.entryRoot,
    tsconfigPath: finalOptions.tsconfigPath,
    include: includes,
    exclude: [
      `${finalOptions.outDir}/**`,
      ...finalOptions.excludes,
    ],

    // 编译器选项
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      declarationDir: finalOptions.outDir,
      declarationMap: finalOptions.sourcemap,
      emitDecoratorMetadata: finalOptions.sourcemap,
    },

    // 插件行为
    clearPureImport: false,
    staticImport: true,
    logLevel: finalOptions.logLevel,
    strictOutput: finalOptions.strict,
  }

  return dtsPlugin(dtsPluginConfig)
}

// 导出一些常用的预设配置
export const dtsPresets = {
  /**
   * 库模式预设
   */
  lib: (customOptions: SimpleDtsOptions = {}): Plugin => {
    return createDtsPlugin({
      entry: ['index.ts'],
      sourcemap: true,
      strict: true,
      ...customOptions,
    })
  },

  /**
   * 应用模式预设
   */
  app: (customOptions: SimpleDtsOptions = {}): Plugin => {
    return createDtsPlugin({
      entry: ['main.ts', 'index.ts'],
      sourcemap: false,
      strict: false,
      ...customOptions,
    })
  },
}
