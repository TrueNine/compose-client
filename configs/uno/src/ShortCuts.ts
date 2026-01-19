import type {StaticShortcut} from 'unocss'

export function shortCuts(): StaticShortcut[] {
  return [
    ['wh-full', 'w-full h-full'],
    ['wh-0', 'w-0 h-0'],
    ['f-c', 'flex justify-center items-center'],
    ['f-x-c', 'flex justify-center'],
    ['f-y-c', 'flex items-center'],
    ['flex-col', 'flex flex-col'],
    ['text-ellipsis', 'truncate'],
    ['text-ell', 'truncate'],
    ['bg-m', 'bg-gray-500 bg-opacity-5'],
    ['bg-m-h', 'hover:bg-gray-500 hover:bg-opacity-5 duration-100'],
    ['bg-m-h-s', 'hover:shadow-md bg-m-h']
  ]
}
