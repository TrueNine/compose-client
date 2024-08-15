import {Archive} from 'libarchive.js'
// @ts-ignore
import u from 'libarchive.js/dist/worker-bundle.js?url'

export class ArchiveJs {
  private static __archiveUrl: string

  static {
    this.__archiveUrl = u
    Archive.init({
      workerUrl: this.__archiveUrl
    })
  }

  static async extract(file: File) {
    const a = this.instance
    const r = await a.open(file)
    return (await r.getFilesArray()) as {file: File; path: string}[]
  }

  static get instance() {
    return Archive
  }
}
