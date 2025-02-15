import type {CreateComponentPublicInstance, Plugin, RendererElement, RendererNode, VNode} from 'vue'
import type {clip, dynamic, Maybe, newable} from '@compose/api-types'

import {maybeArray} from '@/tools'
/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
export interface VueComponentInstanceMapping {
  name?: string
  __name?: string
} /**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
export type SFCWithInstall<T = dynamic> = T & Plugin & VueComponentInstanceMapping & {install: (app: dynamic) => void}
/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
export type a = CreateComponentPublicInstance
/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
type SlotNode = VNode<RendererNode, RendererElement, Record<string, dynamic>> & {actualName?: string}
/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
type NotChildrenSlotNode = clip<SlotNode, 'children'>

/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
export class Vue {
  static UNDEFINED_NAME = 'NameUndefined'

  /**
   * ## 准备一个安装的组件
   * @param component 组件实例
   * @param otherComponent 其他一同注册的组件实例
   * @returns 封装后的组件
   */
  static componentInstallToPlugin<T extends newable = dynamic, E = dynamic>(component: T, otherComponent?: Record<string, E>): T {
    let _p = component as unknown as SFCWithInstall<T>
    const _r = otherComponent as unknown as Record<string, SFCWithInstall<T>>
    if (!_p.name) _p = {..._p, name: _p.__name}
    _p.install = app => {
      for (const c of [_p, ...Object.values(_r != null ? _r : {})]) {
        const {name = void 0, __name = void 0} = _p
        app.component(__name || name || Vue.UNDEFINED_NAME, _p)
        app.component(_p.name || Vue.UNDEFINED_NAME, c)
      }
    }
    if (_r) {
      for (const [key, comp] of Object.entries(_r)) {
        ;(_p as dynamic)[key] = comp
      }
    }
    return _p as unknown as T
  }

  static findSlotNodesBy(compareFn: (node: NotChildrenSlotNode) => boolean = () => true, arg?: Maybe<SlotNode>): SlotNode[] {
    const res: SlotNode[] = []
    const _m = maybeArray(arg).filter(Boolean)
    if (!_m) return []
    _m.forEach(ele => res.push(...this._findSlotNodesBy(ele!, compareFn)))
    return res
  }

  static findSlotNodesByName(componentName = '', arg?: Maybe<SlotNode>): SlotNode[] {
    const res: SlotNode[] = []
    const m = maybeArray(arg).filter(Boolean)
    if (!m) return []
    m.forEach(ele => res.push(...this._findSlotNodesBy(ele!, v => v.actualName === componentName)))
    return res
  }

  private static _findSlotNodesBy(node: Maybe<SlotNode>, compareFn: (node: NotChildrenSlotNode) => boolean = () => true, result: SlotNode[] = []): SlotNode[] {
    const nodes = maybeArray(node)
    nodes.forEach(n => {
      const r = n.type as Record<string, string>
      n.actualName = r.name || r.__name
      if (compareFn(n)) result.push(n)
      if (n.children && typeof n.children !== 'string') this._findSlotNodesBy(n.children as unknown as SlotNode, compareFn, result)
    })
    return result
  }
}
