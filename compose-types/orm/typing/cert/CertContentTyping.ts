import type {Evr} from '../../../enum'

export enum CertContentTyping {
  NONE = 0,
  IMAGE = 1,
  SCANNED_IMAGE = 2,
  SCREEN_SHOT = 3,
  VIDEO = 4,
  RECORDING = 5,
  COPYFILE_IMAGE = 6,
  REMAKE_IMAGE = 7
}

export const CertContentTypingComment: Record<Evr<typeof CertContentTyping>, string> = {
  [CertContentTyping.NONE]: '无要求',
  [CertContentTyping.IMAGE]: '图片',
  [CertContentTyping.SCANNED_IMAGE]: '扫描件图片',
  [CertContentTyping.SCREEN_SHOT]: '屏幕截图',
  [CertContentTyping.VIDEO]: '视频',
  [CertContentTyping.RECORDING]: '录音',
  [CertContentTyping.COPYFILE_IMAGE]: '复印件',
  [CertContentTyping.REMAKE_IMAGE]: '翻拍件'
}

export const CertContentTypingMap: Record<Evr<typeof CertContentTyping>, number> = {
  [CertContentTyping.NONE]: 0,
  [CertContentTyping.IMAGE]: 1,
  [CertContentTyping.SCANNED_IMAGE]: 2,
  [CertContentTyping.SCREEN_SHOT]: 3,
  [CertContentTyping.VIDEO]: 4,
  [CertContentTyping.RECORDING]: 5,
  [CertContentTyping.COPYFILE_IMAGE]: 6,
  [CertContentTyping.REMAKE_IMAGE]: 7
}

export const CertContentTypingReverseMap: Record<Evr<typeof CertContentTyping>, CertContentTyping> = {
  [0]: CertContentTyping.NONE,
  [1]: CertContentTyping.IMAGE,
  [2]: CertContentTyping.SCANNED_IMAGE,
  [3]: CertContentTyping.SCREEN_SHOT,
  [4]: CertContentTyping.VIDEO,
  [5]: CertContentTyping.RECORDING,
  [6]: CertContentTyping.COPYFILE_IMAGE,
  [7]: CertContentTyping.REMAKE_IMAGE
}
