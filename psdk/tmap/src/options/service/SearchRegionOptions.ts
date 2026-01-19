import type {LatLngDataTyping} from '../../LatLng'
import type {ISearchOptions} from './Base'

export interface SearchRegionOptions extends ISearchOptions {
  cityName: string

  referenceLocation?: LatLngDataTyping
}
