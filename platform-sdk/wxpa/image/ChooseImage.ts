import type {BaseOption} from '../common'

type Count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type SizeType = 'original' | 'compressed'
type SourceType = 'album' | 'camera'

export interface ChooseImageSuccessResult {
  locationIds?: string[]
}

export interface ChooseImageOption extends BaseOption<ChooseImageSuccessResult> {
  count?: Count
  sizeType?: SizeType[]
  sourceType?: SourceType[]
}
