/**
 * 用于适配 tailwindcss 被覆盖的样式，需要在挂挂载之前执行
 */
export function naiveStyleAdaptor() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}
