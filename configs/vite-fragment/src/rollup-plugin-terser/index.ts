import type {Options as RollupPluginTerserOptions} from '@rollup/plugin-terser'
import rollupTerser from '@rollup/plugin-terser'
import {mergeConfig} from 'vite'

import type {ManifestConfig} from '../types'

export const RollupPluginTerser = (cfg: ManifestConfig, options: RollupPluginTerserOptions) => {
  if (cfg.features.lib.minify) {
    const c = mergeConfig(cfg.features.lib.terserOptions ?? {}, options ?? {})
    return rollupTerser(c)
  }
}

export const RollupPluginTerserDefaultOptions = (cfg: ManifestConfig): RollupPluginTerserOptions => {
  const isUnsafe = cfg.features.lib.minifyUnsafe
  return {
    compress: {
      drop_debugger: true,
      drop_console: true,
      pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.error', 'console.table', 'console.dir'],
      booleans: isUnsafe,
      passes: 3, // 多次压缩
      reduce_funcs: true, // 减少函数代码
      reduce_vars: true, // 减少变量代码
      toplevel: true, // 顶级作用域压缩
      booleans_as_integers: isUnsafe, // true 1
      unsafe: isUnsafe, // 启用不安全的优化
      unsafe_arrows: isUnsafe, // 转换箭头函数
      unsafe_comps: isUnsafe, // 不安全地压缩比较
      unsafe_math: isUnsafe, // 不安全地优化数学表达式
      unsafe_proto: isUnsafe, // 不安全地优化原型
      unsafe_undefined: isUnsafe // 将 undefined 作为一个标识符处理
    },
    mangle: {
      toplevel: true, // 混淆顶级作用域的变量和函数名
      properties: {
        regex: /^_/ // 混淆所有以 _ 开头的属性名
      }
    },
    format: {
      inline_script: isUnsafe, // 确保压缩到一行
      comments: false // 删除注释
    }
  }
}
