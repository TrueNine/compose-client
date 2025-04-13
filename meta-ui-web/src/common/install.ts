import type { dynamic } from '@compose/api-types'
import type { App } from 'vue'

interface VueComponentInstanceMapping {
  name?: string
  __name?: string
}

type SFCWithInstall<T = dynamic> = T & VueComponentInstanceMapping & { install: (app: App) => void }

const undefinedName = 'NameUndefined'

/**
 * ## 准备一个安装的组件
 *
 * @param component 组件实例
 * @param otherComponent 其他一同注册的组件实例
 * @returns 封装后的组件
 */
export function componentInstallToPlugin<T, E = dynamic>(component: T, otherComponent?: Record<string, E>): T {
  let primaryComponent = component as unknown as SFCWithInstall<T>
  const otherSecondaryComponentInstallers = otherComponent as unknown as Record<string, SFCWithInstall<T>> | undefined
  if (primaryComponent.name == null) {
    primaryComponent = { ...primaryComponent, name: primaryComponent.__name }
  }
  primaryComponent.install = (app: App) => {
    const allInstallComponents = [primaryComponent, ...Object.values(otherSecondaryComponentInstallers ?? {})]
    for (const toInstallComponent of allInstallComponents) {
      const { name = void 0, __name = void 0 } = toInstallComponent
      app.component(name ?? __name ?? undefinedName, toInstallComponent)
    }
  }
  if (otherSecondaryComponentInstallers) {
    for (const [key, comp] of Object.entries(otherSecondaryComponentInstallers)) {
      ;(primaryComponent as Record<string, unknown>)[key] = comp
    }
  }
  return primaryComponent as T
}
