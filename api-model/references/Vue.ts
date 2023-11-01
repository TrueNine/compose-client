import {type Plugin} from 'vue'
import type {SafeAny} from '@compose/compose-types'

export interface VueComponentInstanceMapping {
  name?: string
  __name?: string
}

/**
 * ## 针对 vue 封装的一些工具函数
 */
export class Vue {
  static UNDEFINED_NAME = 'NameUndefined'

  /**
   * ## 准备一个安装的组件
   * @param component 组件
   * @param otherComponent
   * @returns 封装后的组件
   */
  static componentInstallToPlugin<T>(component: T, otherComponent?: Record<string, T>): T & Plugin & VueComponentInstanceMapping {
    let _p = component as unknown as T & Plugin & VueComponentInstanceMapping
    const _r = otherComponent as unknown as Record<string, T & Plugin & VueComponentInstanceMapping>
    if (!_p.name) _p = {..._p, name: _p.__name}
    _p.install = app => {
      for (const c of [_p, ...Object.values(_r != null ? _r : {})]) {
        const {name = undefined, __name = undefined} = _p
        if (name) app.component(name, _p)
        else app.component(__name ?? name ?? Vue.UNDEFINED_NAME, _p)
        app.component(_p.name ?? Vue.UNDEFINED_NAME, c)
      }
    }
    if (_r) {
      for (const [key, comp] of Object.entries(_r)) {
        ;(_p as SafeAny)[key] = comp
      }
    }
    return _p
  }
}
