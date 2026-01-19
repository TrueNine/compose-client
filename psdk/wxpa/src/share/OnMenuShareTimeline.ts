import type {BaseCancelableOption} from '../common'

import type {UpdateTimelineShareDataOption} from './UpdateTimelineShareData'

type ShareType = 'link' | 'music' | 'video'

export interface OnMenuShareTimelineOption extends UpdateTimelineShareDataOption, BaseCancelableOption {
  type?: ShareType
  dataUrl?: string
}
