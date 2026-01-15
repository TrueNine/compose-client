import type {Plugin} from 'vite'
import type {PluginOptions} from 'vite-plugin-dts'
import dtsPluginImport from 'vite-plugin-dts'

const dtsPlugin = (dtsPluginImport as unknown as {default: typeof dtsPluginImport}).default ?? dtsPluginImport

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
  logLevel: 'error',
}

/**
 * 创建简化版的 DTS 插件
 */
export function createDtsPlugin(options: SimpleDtsOptions = {}): Plugin {
  const finalOptions = {...DEFAULT_OPTIONS, ...options}

  const extensions = new Set( // 收集所有入口文件的后缀
    finalOptions.entry.map(entry => {
      const match = /\.([^.]+)$/.exec(entry)
      return match ? match[1] : 'ts'
    }),
  )

  const includes = [...extensions].map(ext => // 生成包含所有后缀的 glob 模式
    `${finalOptions.entryRoot}/**/*.${ext}`)

  const dtsPluginConfig: PluginOptions = {
    entryRoot: finalOptions.entryRoot, // 基础配置
    tsconfigPath: finalOptions.tsconfigPath,
    include: includes,
    exclude: [
      `${finalOptions.outDir}/**`,
      ...finalOptions.excludes,
    ],

    compilerOptions: { // 编译器选项
      declaration: true,
      emitDeclarationOnly: true,
      declarationDir: finalOptions.outDir,
      declarationMap: finalOptions.sourcemap,
      emitDecoratorMetadata: finalOptions.sourcemap,
    },

    clearPureImport: false, // 插件行为
    staticImport: true,
    logLevel: finalOptions.logLevel,
    strictOutput: finalOptions.strict,

    rollupOptions: {}, // 错误处理 - 确保 dts 生成错误时构建失败

    beforeWriteFile: (filePath: string, content: string) => { // 使用 beforeWriteFile 钩子来验证生成的文件
      if (!content || content.trim().length === 0) throw new Error(`DTS generation failed: Empty declaration file generated for ${filePath}`)
      return {filePath, content}
    },
  }

  const plugin = dtsPlugin(dtsPluginConfig)

  return plugin
}

export const dtsPresets = { // 导出一些常用的预设配置
  /**
   * 库模式预设
   */
  lib: (customOptions: SimpleDtsOptions = {}): Plugin => createDtsPlugin({entry: ['index.ts'], sourcemap: true, strict: true, ...customOptions}),

  /**
   * 应用模式预设
   */
  app: (customOptions: SimpleDtsOptions = {}): Plugin => createDtsPlugin({entry: ['main.ts', 'index.ts'], sourcemap: false, strict: false, ...customOptions}),
}
