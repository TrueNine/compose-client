import fs from 'fs'
import path from 'path'

/**
 * 创建一个空文件
 */
export function empty() {
  const rootDir = process.cwd()
  fs.writeFileSync(
    path.resolve(rootDir, 'src/pages.json'),
    `{
	"pages": [
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		}
	],
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#F8F8F8",
		"backgroundColor": "#F8F8F8"
	}
}
`
  )
  fs.writeFileSync(
    path.resolve(rootDir, 'src/manifest.json'),
    `{
  "name": "gen",
  "appid": "gen",
  "description": "gen",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "mp-weixin": {
    "appid": "",
    "setting": {
      "urlCheck": false
    },
    "usingComponents": true
  },
  "mp-alipay": {
    "usingComponents": true
  },
  "mp-baidu": {
    "usingComponents": true
  },
  "mp-toutiao": {
    "usingComponents": true
  },
  "uniStatistics": {
    "enable": false
  },
  "vueVersion": "3"
}
`
  )
  fs.writeFileSync(path.resolve(rootDir, 'src/uni.scss'), '')
}
