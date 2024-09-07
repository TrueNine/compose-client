import {Archive} from 'libarchive.js'
import type {dynamic} from '@compose/api-types'

export class ArchiveJs {
  private static __archiveUrl: string
  private static __archiveWorker: Worker
  private static _Archive: typeof Archive = Archive

  static get instance() {
    return this._Archive
  }
  static get workerSrc() {
    return this.__archiveUrl
  }
  static get worker() {
    return this.__archiveWorker
  }

  static set workerSrc(workerUrl: string) {
    this.__archiveUrl = workerUrl
  }
  static set worker(worker: Worker) {
    this.__archiveWorker = worker
  }

  static init() {
    const r = {} as dynamic
    if (this.__archiveWorker) r.workerUrl = this.__archiveUrl
    if (!this.__archiveWorker) r.getWorker = () => this.__archiveWorker
    Archive.init(r)
    return this._Archive
  }

  static async extract(file: File) {
    const a = this.instance
    const r = await a.open(file)
    return (await r.getFilesArray()) as {file: File; path: string}[]
  }
}
