import type { dynamic } from '@compose/api-types'
import { Archive } from 'libarchive.js'

export const ArchiveJs: typeof Archive = Archive
let __archiveUrl: string | undefined
let __archiveWorker: Worker | undefined

export function setWorkerSrc(workerUrl: string): void {
  __archiveUrl = workerUrl
}

export function setWorker(worker: Worker): void {
  __archiveWorker = worker
}

export function init(): void {
  const r = {} as dynamic
  if (__archiveWorker)
    r.workerUrl = __archiveUrl
  if (__archiveWorker)
    r.getWorker = () => __archiveWorker
  Archive.init(r)
}

export async function extract(file: File): Promise<{ file: File, path: string }[]> {
  const r = await ArchiveJs.open(file)
  return (await r.getFilesArray()) as { file: File, path: string }[]
}
