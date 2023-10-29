import {createRequire as _} from 'node:module'

/**
 * @param url import.meta.url
 */
export function createRequire(url: string) {
  return _(url)
}
