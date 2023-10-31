import {createRequire as m} from 'node:module'

/**
 * @param url import.meta.url
 */
export function createRequire(url: string) {
  return m(url)
}
