import {Archive} from 'libarchive.js'

// FIXME 当前文件所有文件需要进行去除副作用优化

interface ArchiveOptions {
  workerUrl?: string
  getWorker?: () => Worker
}

export const ArchiveJs: typeof Archive = Archive
let __archiveUrl: string | undefined,
  __archiveWorker: Worker | undefined

export function setWorkerSrc(workerUrl: string): void {
  __archiveUrl = workerUrl
}

export function setWorker(worker: Worker): void {
  __archiveWorker = worker
}

export function init(): void {
  const archiveOptions: ArchiveOptions = {}
  if (__archiveWorker) archiveOptions.workerUrl = __archiveUrl
  if (__archiveWorker) {
    const worker = __archiveWorker
    archiveOptions.getWorker = () => worker
  }
  Archive.init(archiveOptions)
}

export async function extract(file: File): Promise<{file: File, path: string}[]> {
  const archiveInstance = await ArchiveJs.open(file)
  return (await archiveInstance.getFilesArray()) as {file: File, path: string}[]
}
