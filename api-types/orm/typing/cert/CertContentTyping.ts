import type {EnumCommentMap, EnumMap} from '../../../enum'

export enum CertContentTyping {
  NONE = 0,
  IMAGE = 1,
  SCANNED_IMAGE = 2,
  SCREEN_SHOT = 3,
  VIDEO = 4,
  RECORDING = 5,
  COPYFILE_IMAGE = 6,
  REMAKE_IMAGE = 7,
  PROCESSED_SCANNED_IMAGE = 8,
  PROCESSED_IMAGE = 9,
  PROCESSED_VIDEO = 10,
  PROCESSED_AUDIO = 11
}

export const CertContentTypingComment: EnumCommentMap<typeof CertContentTyping> = {
  [CertContentTyping.NONE]: '无要求',
  [CertContentTyping.IMAGE]: '图片',
  [CertContentTyping.SCANNED_IMAGE]: '扫描件图片',
  [CertContentTyping.SCREEN_SHOT]: '屏幕截图',
  [CertContentTyping.VIDEO]: '视频',
  [CertContentTyping.RECORDING]: '录音',
  [CertContentTyping.COPYFILE_IMAGE]: '复印件',
  [CertContentTyping.REMAKE_IMAGE]: '翻拍件',
  [CertContentTyping.PROCESSED_SCANNED_IMAGE]: '处理过的扫描件图片',
  [CertContentTyping.PROCESSED_IMAGE]: '处理过的图片',
  [CertContentTyping.PROCESSED_VIDEO]: '处理过的视频',
  [CertContentTyping.PROCESSED_AUDIO]: '处理过的音频'
}

export const CertContentTypingMap: EnumMap<typeof CertContentTyping> = {
  [CertContentTyping.NONE]: 0,
  [CertContentTyping.IMAGE]: 1,
  [CertContentTyping.SCANNED_IMAGE]: 2,
  [CertContentTyping.SCREEN_SHOT]: 3,
  [CertContentTyping.VIDEO]: 4,
  [CertContentTyping.RECORDING]: 5,
  [CertContentTyping.COPYFILE_IMAGE]: 6,
  [CertContentTyping.REMAKE_IMAGE]: 7,
  [CertContentTyping.PROCESSED_SCANNED_IMAGE]: 8,
  [CertContentTyping.PROCESSED_IMAGE]: 9,
  [CertContentTyping.PROCESSED_VIDEO]: 10,
  [CertContentTyping.PROCESSED_AUDIO]: 11
}

export const CertContentTypingReverseMap: EnumMap<typeof CertContentTyping> = {
  [0]: CertContentTyping.NONE,
  [1]: CertContentTyping.IMAGE,
  [2]: CertContentTyping.SCANNED_IMAGE,
  [3]: CertContentTyping.SCREEN_SHOT,
  [4]: CertContentTyping.VIDEO,
  [5]: CertContentTyping.RECORDING,
  [6]: CertContentTyping.COPYFILE_IMAGE,
  [7]: CertContentTyping.REMAKE_IMAGE,
  [8]: CertContentTyping.PROCESSED_SCANNED_IMAGE,
  [9]: CertContentTyping.PROCESSED_IMAGE,
  [10]: CertContentTyping.PROCESSED_VIDEO,
  [11]: CertContentTyping.PROCESSED_AUDIO
}
