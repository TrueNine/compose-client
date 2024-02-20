import {MediaTypes} from '../consts'

export function findMediaTypeByFileName(fileName: string): string {
  const o = fileName.split('.').pop() ?? (MediaTypes.other as unknown as keyof typeof MediaTypes)
  const f = MediaTypes[o as unknown as keyof typeof MediaTypes]
  return f || MediaTypes.other
}
