import { componentInstallToPlugin } from '@truenine/vue/Install'
import YdDeviceFace from './YdDeviceFace.vue'

export interface YdDeviceFaceProps {
  src: string
  rotate?: number
}
export interface YdDeviceFaceEmits {
  rotate: [angle: number]
}

export default componentInstallToPlugin(YdDeviceFace)
