import {readPackageJson as readJson} from '@/resolve'
import type {RubbishPluginConfig, UniAppManifestJson, UniAppPagesJson, ScssVariableDefs} from '../Def'
import {fillVkUview, fillUniScss, vkUviewImport} from '@/Snippets'
import fs from 'fs'
import {debug} from '../util'

/**
 * @param configOptions 处理用户配置
 */
export function userConfigFactory(configOptions: Required<RubbishPluginConfig>): void {
  const config = configOptions.config
  const packageJson = readJson<Record<string, string>>(configOptions.packageJson)
  const useUniComponents = configOptions.config.root?.useUni ?? false
  const useVkUViewComponents = configOptions.config.root?.useVkUView ?? false

  function _debug(msg: unknown) {
    return debug(msg, configOptions.debugMode === true)
  }

  function injctionManifest(): UniAppManifestJson {
    return {
      vueVersion: '3',
      name: packageJson['name'],
      versionName: packageJson['version'],
      versionCode: '1000',
      appid: config.appid,
      'mp-weixin': {
        appid: config.wechat?.appId ?? config.appid ?? '',
        usingComponents: true,
        setting: {
          minified: config.optimization?.wechatMinified ?? true,
          es6: config.optimization?.wechatEs6 ?? true,
          postcss: true,
          bigPackageSizeSupport: false
        },
        optimization: {
          subPackages: config.optimization?.wechatSubPackage ?? true
        },
        lazyCodeLoading: config.optimization?.wechatLazyCodeLoading ? 'requiredComponents' : undefined
      },
      'mp-alipay': {
        usingComponents: true
      },
      'mp-toutiao': {
        usingComponents: true
      }
    }
  }
  const manifest: UniAppManifestJson = {
    ...injctionManifest(),
    ...config.nativeManifest
  }
  _debug(JSON.stringify(manifest, null, 2))

  function injectionPagesJson(): UniAppPagesJson {
    function useEasyCom(): UniAppPagesJson['easycom'] {
      const __use = useUniComponents || useVkUViewComponents
      const __r = configOptions.config.root
      const components: Record<string, string> = {}
      if (__r?.useUni) components['^uni-(.*)'] = '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue'
      if (__r?.useVkUView) components['^u-(.*)'] = 'vk-uview-ui/components/u-$1/u-$1.vue'
      return __use
        ? {
            autoscan: true,
            custom: {...components}
          }
        : undefined
    }

    // 混合 pages
    const __styledPages = config.pages?.map(r => ({
      path: r.path,
      style: {
        navigationBarTitleText: r.title,
        navigationBarTextStyle: r.textColor ?? configOptions.config.style?.title?.textColor,
        navigationBarBackgroundColor: r.bgColor ?? configOptions.config.style?.title?.bgColor
      }
    }))

    // 混合 globalStyle
    const __globalStype: UniAppPagesJson['globalStyle'] = {
      navigationBarBackgroundColor: config.style?.title?.bgColor,
      navigationBarTextStyle: config.style?.title?.textColor,
      navigationBarTitleText: packageJson['name']
    }

    // 混合 tabbar
    const __tabbar: UniAppPagesJson['tabBar'] = {
      color: config.style?.tabBar?.textColor ?? '#ffffff',
      selectedColor: config.style?.tabBar?.activeBgColor ?? '#ffffff',
      borderStyle: config.style?.tabBar?.borderColor,
      backgroundColor: config.style?.tabBar?.bgColor,
      list: config.tabBar?.map(r => ({pagePath: r.path, text: r.title}))
    }

    return {
      transformPx: config.style?.transformPx,
      easycom: useEasyCom(),
      pages: __styledPages,
      globalStyle: __globalStype,
      tabBar: __tabbar
    }
  }
  const pages: UniAppPagesJson = {
    ...injectionPagesJson(),
    ...config.nativePages
  }
  _debug(JSON.stringify(pages, null, 2))

  function injectionUniScss(): string {
    function injectionVar(): ScssVariableDefs {
      let ___vars: ScssVariableDefs = {}
      if (config.root?.useVkUView) ___vars = Object.assign(___vars, fillVkUview(config.style?.theme))
      return Object.assign(___vars, fillUniScss())
    }

    const __vars = Object.entries(injectionVar())
      .map(([k, v]) => `${k}: ${v}\n`)
      .reduce((a, b) => a + b, '')
    function injectionImport(): string {
      let ___import = ''
      ___import += config.root?.useVkUView ? `${vkUviewImport}\n` : ''
      return ___import
    }

    const __import = injectionImport()
    return `
    ${__import}
    ${__vars}
    `.trim()
  }
  const scss = injectionUniScss()
  _debug(scss)

  function writeAll() {
    // 导出文件
    if (notGenerated(configOptions.packageJson))
      fs.writeFileSync(configOptions.pages, `// ${configGenerated}\n${JSON.stringify(pages, null, 2)}`, {encoding: 'utf-8'})
    else _debug(`不需要写入 ${configOptions.packageJson}`)
    if (notGenerated(configOptions.manifest))
      fs.writeFileSync(configOptions.manifest, `// ${configGenerated}\n${JSON.stringify(manifest, null, 2)}`, {encoding: 'utf-8'})
    else _debug(`不需要写入 ${configOptions.manifest}`)
    if (notGenerated(configOptions.uniScss)) fs.writeFileSync(configOptions.uniScss, `/* ${configGenerated} */\n${scss}`, {encoding: 'utf-8'})
    else _debug(`不需要写入 ${configOptions.uniScss}`)
  }
  writeAll()
}

export const configGenerated = 'this config generated by vite plugin'

export function notGenerated(root: string): boolean {
  try {
    return !fs.readFileSync(root, 'utf-8').includes(configGenerated)
  } catch (e) {
    return true
  }
}
