export enum DocumentContentTyping {
  NONE = 0,
  IMAGE = 1,
  SCANNED_IMAGE = 2,
  SCREEN_SHOT = 3,
  VIDEO = 4,
  RECORDING = 5,
  COPYFILE_IMAGE = 6,
  REMAKE_IMAGE = 7
}

export const DocumentContentTypingComment = {
  [DocumentContentTyping.NONE]: '无要求',
  [DocumentContentTyping.IMAGE]: '图片',
  [DocumentContentTyping.SCANNED_IMAGE]: '扫描件图片',
  [DocumentContentTyping.SCREEN_SHOT]: '屏幕截图',
  [DocumentContentTyping.VIDEO]: '视频',
  [DocumentContentTyping.RECORDING]: '录音',
  [DocumentContentTyping.COPYFILE_IMAGE]: '复印件',
  [DocumentContentTyping.REMAKE_IMAGE]: '翻拍件'
}
export const DocumentContentTypingMap = {
  [DocumentContentTyping.NONE]: 0,
  [DocumentContentTyping.IMAGE]: 1,
  [DocumentContentTyping.SCANNED_IMAGE]: 2,
  [DocumentContentTyping.SCREEN_SHOT]: 3,
  [DocumentContentTyping.VIDEO]: 4,
  [DocumentContentTyping.RECORDING]: 5,
  [DocumentContentTyping.COPYFILE_IMAGE]: 6,
  [DocumentContentTyping.REMAKE_IMAGE]: 7
}
export const DocumentContentTypingReverseMap = {
  [0]: DocumentContentTyping.NONE,
  [1]: DocumentContentTyping.IMAGE,
  [2]: DocumentContentTyping.SCANNED_IMAGE,
  [3]: DocumentContentTyping.SCREEN_SHOT,
  [4]: DocumentContentTyping.VIDEO,
  [5]: DocumentContentTyping.RECORDING,
  [6]: DocumentContentTyping.COPYFILE_IMAGE,
  [7]: DocumentContentTyping.REMAKE_IMAGE
}
