import {Archive} from 'libarchive.js'
import type {dynamic} from '@compose/api-types'

export const ArchiveJs: typeof Archive = Archive
let __archiveUrl: string | undefined
let __archiveWorker: Worker | undefined

export function setWorkerSrc(workerUrl: string) {
  __archiveUrl = workerUrl
}

export function setWorker(worker: Worker) {
  __archiveWorker = worker
}

export function init() {
  const r = {} as dynamic
  if (__archiveWorker) r.workerUrl = __archiveUrl
  if (__archiveWorker) r.getWorker = () => __archiveWorker
  Archive.init(r)
}

export async function extract(file: File) {
  const r = await ArchiveJs.open(file)
  return (await r.getFilesArray()) as {file: File; path: string}[]
}
