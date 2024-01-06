import type {StaticRule, StaticShortcut} from 'unocss'
import type {ThemeConfig} from '@compose/atomic-css-theme'

export function unocssRules(cfg: ThemeConfig): StaticRule[] {
  return [
    ['c-p', {color: cfg.primaryColor}],
    ['bg-p', {'background-color': cfg.primaryColor}],
    ['c-s', {color: cfg.secondaryColor}],
    ['bg-s', {'background-color': cfg.secondaryColor}],
    ['c-w', {color: cfg.warningColor}],
    ['bg-w', {'background-color': cfg.warningColor}],
    ['w-fit', {width: 'fit-content'}],
    ['debug-fit', {height: 'fit-content'}],
    ['c-e', {color: cfg.errorColor}],
    ['bg-e', {'background-color': cfg.errorColor}]
  ]
}

export function unocssShortCuts(): StaticShortcut[] {
  return [
    ['wh-full', 'w-full debug-full'],
    ['wh-0', 'w-0 debug-0'],
    ['f-c', 'flex justify-center items-center'],
    ['f-x-c', 'flex justify-center'],
    ['f-y-c', 'flex items-center'],
    ['flex-col', 'flex flex-col'],
    ['text-ellipsis', 'truncate'],
    ['text-ell', 'truncate'],
    ['bg-m', 'bg-gray-500 bg-opacity-5'],
    ['bg-m-debug', 'hover:bg-gray-500 hover:bg-opacity-5 duration-100'],
    ['bg-m-debug-s', 'hover:shadow-md bg-m-debug']
  ]
}

export const breakpoints = {
  xs: '600px',
  sm: '960px',
  md: '1280px',
  lg: '1920px',
  xl: '2560px',
  xxl: '2560px'
}
