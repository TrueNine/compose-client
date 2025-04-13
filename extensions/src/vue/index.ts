import type { clip, dynamic, Maybe } from '@compose/api-types'
import type {
  ComponentOptionsMixin,
  ComponentPropsOptions,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  ExtractDefaultPropTypes,
  ExtractPropTypes,
  MethodOptions,
  ObjectEmitsOptions,
  PublicProps,
  RendererElement,
  RendererNode,
  SlotsType,
  VNode,
} from 'vue'
import { maybeArray } from '@compose/api-model'

type EmitsToProps<T extends EmitsOptions> = T extends string[]
  ? Partial<Record<`on${Capitalize<T[number]>}`, (...args: dynamic[]) => dynamic>>
  : T extends ObjectEmitsOptions
    ? {
        [K in `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
          ? (...args: T[Uncapitalize<C>] extends (...args: infer P) => dynamic ? P : T[Uncapitalize<C>] extends null ? dynamic[] : never) => dynamic
          : never
      }
    : object
type ResolveProps<PropsOrPropOptions, E extends EmitsOptions> = Readonly<
  PropsOrPropOptions extends ComponentPropsOptions ? ExtractPropTypes<PropsOrPropOptions> : PropsOrPropOptions
> &
(object extends E ? object : EmitsToProps<E>)

type SlotNode = VNode<RendererNode, RendererElement, Record<string, dynamic>> & { actualName?: string }
type NotChildrenSlotNode = clip<SlotNode, 'children'>

export interface GenericProps<
  Props extends object = object,
  Emits extends EmitsOptions = Record<string, null>,
  Slots extends SlotsType = SlotsType,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
> {
  props?: Props
  emits?: Emits
  slots?: Slots
  mixin?: Mixin
}

export type DefineComponentPart<
  Props,
  Emits extends EmitsOptions,
  Slots extends SlotsType = SlotsType,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Expose = object,
  _D = object,
  _ComputedOptions extends ComputedOptions = ComputedOptions,
  _MethodOptions extends MethodOptions = MethodOptions,
  _ExtendsComponentOptionsMixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  _EE extends string = string,
  _PP = PublicProps,
  _Props = ResolveProps<Props, Emits>,
  _Defaults = ExtractDefaultPropTypes<Props>,
> = DefineComponent<Props, Expose, _D, _ComputedOptions, _MethodOptions, Mixin, _ExtendsComponentOptionsMixin, Emits, _EE, _PP, _Props, _Defaults, Slots>

function _findSlotNodesBy(node: Maybe<SlotNode>, compareFn: (node: NotChildrenSlotNode) => boolean = () => true, result: SlotNode[] = []): SlotNode[] {
  const nodes = maybeArray(node)
  nodes.forEach((n) => {
    const r = n.type as Record<string, string>
    n.actualName = r.name || r.__name
    if (compareFn(n)) {
      result.push(n)
    }
    if (n.children && typeof n.children !== 'string') {
      _findSlotNodesBy(n.children as unknown as SlotNode, compareFn, result)
    }
  })
  return result
}

export function findSlotNodesBy(compareFn: (node: NotChildrenSlotNode) => boolean = () => true, arg?: Maybe<SlotNode>): SlotNode[] {
  const res: SlotNode[] = []
  const _m = maybeArray(arg).filter(Boolean) as SlotNode[]
  _m.forEach((ele) => res.push(..._findSlotNodesBy(ele, compareFn)))
  return res
}

export function findSlotNodesByName(componentName = '', arg?: Maybe<SlotNode>): SlotNode[] {
  const res: SlotNode[] = []
  const m = maybeArray(arg).filter(Boolean) as SlotNode[]
  m.forEach((ele) => res.push(..._findSlotNodesBy(ele, (v) => v.actualName === componentName)))
  return res
}

export * from './Types'
