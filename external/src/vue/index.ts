import type { clip, dynamic, Maybe } from '@truenine/types'
import type {
  RendererElement,
  RendererNode,
  VNode,
} from 'vue'
import { maybeArray } from '@truenine/shared'

/**
 * 表示 Vue 插槽节点的类型定义
 * 继承自 Vue 的 VNode，并添加了 actualName 可选属性用于存储实际组件名
 */
type SlotNode = VNode<RendererNode, RendererElement, Record<string, dynamic>> & { actualName?: string }

/**
 * 从 SlotNode 类型中排除 children 属性的类型
 * 用于在比较函数中避免处理子节点
 */
type NotChildrenSlotNode = clip<SlotNode, 'children'>

/**
 * 递归查找符合条件的插槽节点
 *
 * @param slotNode - 要搜索的插槽节点或节点数组
 * @param compareFn - 用于判断节点是否符合条件的比较函数，默认返回 true
 * @param accumulator - 用于累积找到的节点的数组
 * @returns 符合条件的插槽节点数组
 *
 * @internal
 */
function _findSlotNodesBy(
  slotNode: Maybe<SlotNode>,
  compareFn: (node: NotChildrenSlotNode) => boolean = () => true,
  accumulator: SlotNode[] = [],
): SlotNode[] {
  const slotNodes = maybeArray(slotNode)
  slotNodes.forEach(currentNode => {
    const componentType = currentNode.type as Record<string, string>
    currentNode.actualName = componentType.name ?? componentType.__name ?? ''

    if (compareFn(currentNode)) accumulator.push(currentNode)

    const nodeChildren = currentNode.children
    if (nodeChildren != null && typeof nodeChildren === 'object') _findSlotNodesBy(nodeChildren as unknown as SlotNode, compareFn, accumulator)
  })
  return accumulator
}

/**
 * 根据自定义比较函数查找插槽节点
 *
 * @param compareFn - 用于判断节点是否符合条件的比较函数，默认返回 true
 * @param targetNode - 要搜索的目标节点或节点数组
 * @returns 所有符合比较函数条件的插槽节点数组
 *
 * @example
 * ```ts
 * // 查找所有 div 类型的插槽节点
 * const divNodes = findSlotNodesBy(
 *   node => (node.type as any) === 'div',
 *   parentNode
 * )
 * ```
 */
export function findSlotNodesBy(
  compareFn: (node: NotChildrenSlotNode) => boolean = () => true,
  targetNode?: Maybe<SlotNode>,
): SlotNode[] {
  const resultNodes: SlotNode[] = []
  const validNodes = maybeArray(targetNode).filter(Boolean) as SlotNode[]
  validNodes.forEach(slotNode => resultNodes.push(..._findSlotNodesBy(slotNode, compareFn)))
  return resultNodes
}

/**
 * 根据组件名称查找插槽节点
 *
 * @param componentName - 要查找的组件名称，默认为空字符串
 * @param targetNode - 要搜索的目标节点或节点数组
 * @returns 所有匹配指定组件名称的插槽节点数组
 *
 * @example
 * ```ts
 * // 查找所有名为 'MyComponent' 的插槽节点
 * const myComponentNodes = findSlotNodesByName('MyComponent', parentNode)
 * ```
 */
export function findSlotNodesByName(
  componentName = '',
  targetNode?: Maybe<SlotNode>,
): SlotNode[] {
  const resultNodes: SlotNode[] = []
  const validNodes = maybeArray(targetNode).filter(Boolean) as SlotNode[]
  validNodes.forEach(slotNode =>
    resultNodes.push(..._findSlotNodesBy(slotNode, node => node.actualName === componentName)),
  )
  return resultNodes
}

export * from './Types'
