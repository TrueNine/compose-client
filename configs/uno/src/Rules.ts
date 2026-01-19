import type {StaticRule} from 'unocss'
import type {ThemeConfig} from './Theme'

export function unoRules(cfg: ThemeConfig): StaticRule[] {
  return [
    ['c-p', {color: cfg.primaryColor ?? `var(--primary-color)`}],
    ['bg-p', {'background-color': cfg.primaryColor ?? `var(--primary-color)`}],
    ['c-s', {color: cfg.secondaryColor ?? `var(--secondary-color)`}],
    ['bg-s', {'background-color': cfg.secondaryColor ?? `var(--secondary-color)`}],
    ['c-w', {color: cfg.warningColor ?? `var(--warning-color)`}],
    ['bg-w', {'background-color': cfg.warningColor ?? `var(--warning-color)`}],
    ['w-fit', {width: 'fit-content'}],
    ['h-fit', {height: 'fit-content'}],
    ['c-e', {color: cfg.errorColor ?? `var(--error-color)`}],
    ['bg-e', {'background-color': cfg.errorColor ?? `var(--error-color)`}]
  ]
}
