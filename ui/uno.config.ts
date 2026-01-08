import type {UserConfig} from 'unocss'
import {defaultConfig} from '@truenine/config-uno'
import {mergeConfigs} from 'unocss'

const config: UserConfig = mergeConfigs([defaultConfig()])

export default config
