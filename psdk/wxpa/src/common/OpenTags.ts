export interface OpenTagListMap {
  'wx-open-launch-weapp': never
  'wx-open-launch-app': never
  'wx-open-subscribe': never
  'wx-open-audio': never
}

export const OpenTagList: (keyof OpenTagListMap)[] = [...new Set<keyof OpenTagListMap>(['wx-open-launch-weapp', 'wx-open-launch-app', 'wx-open-subscribe', 'wx-open-audio'])]
