import {darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, zhCN} from 'naive-ui'

/**
 * 用于适配 tailwindcss 被覆盖的样式，需要在挂挂载之前执行
 */
function naiveStyleAdaptor() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}
export {
  naiveStyleAdaptor,
  darkTheme as NaiveDarkTheme,
  zhCN as NaiveZhCn,
  lightTheme as NaiveLightTheme,
  dateEnUS as NaiveDateEnUs,
  enUS as NaiveEnUs,
  dateZhCN as NaiveDateZhCN
}
