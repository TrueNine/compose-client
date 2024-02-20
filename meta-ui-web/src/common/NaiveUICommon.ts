import {darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, zhCN} from 'naive-ui'
import type {App} from 'vue'

/**
 * 用于适配 tailwindcss 被覆盖的样式，需要在挂挂载之前执行
 */
function naiveStyleAdaptor() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

function naiveUIRegister(app: App) {
  console.trace(`naive register start`)
  console.trace(app)
  naiveStyleAdaptor()
}

export {
  naiveUIRegister,
  naiveStyleAdaptor,
  darkTheme as NaiveDarkTheme,
  zhCN as NaiveZhCn,
  lightTheme as NaiveLightTheme,
  dateEnUS as NaiveDateEnUs,
  enUS as NaiveEnUs,
  dateZhCN as NaiveDateZhCN
}
