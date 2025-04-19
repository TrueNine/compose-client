import { darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, zhCN } from 'naive-ui'

/**
 * 用于适配 tailwindcss 被覆盖的样式，需要在挂挂载之前执行
 */
function naiveStyleAdaptor(): void {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

function naiveUIRegister(): void {
  naiveStyleAdaptor()
}

export {
  darkTheme as NaiveDarkTheme,
  dateEnUS as NaiveDateEnUs,
  dateZhCN as NaiveDateZhCN,
  enUS as NaiveEnUs,
  lightTheme as NaiveLightTheme,
  naiveStyleAdaptor,
  naiveUIRegister,
  zhCN as NaiveZhCn,
}
