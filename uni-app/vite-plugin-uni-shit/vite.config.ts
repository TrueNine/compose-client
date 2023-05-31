import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [
    import('./es/index').then(r =>
      r.vitePluginRubbishUniApp({
        debugMode: true,
        config: {
          appid: '1234',
          optimization: {
            wechatLazyCodeLoading: true
          },
          style: {
            transformPx: true,
            title: {
              textColor: 'black',
              bgColor: '#abc'
            }
          },
          pages: [
            {
              path: 'pages/a',
              title: '我日你娘'
            }
          ],
          root: {
            useUni: true,
            useVkUView: true
          },
          tabBar: [
            {
              path: ''
            }
          ]
        }
      })
    )
  ]
})
