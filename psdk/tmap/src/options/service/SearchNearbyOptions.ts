import type {LatLngDataTyping} from '../../LatLng'
import type {ISearchOptions} from './Base'

export interface SearchNearbyOptions extends ISearchOptions {
  center: LatLngDataTyping
  radius: number
}
