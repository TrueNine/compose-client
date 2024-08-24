import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/docs/',
  outDir: 'docs',
  title: '产品使用文档',
  description: '有不懂得，记得先看看文档，能解决大部分问题',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: '指南', link: '/guide'},
      {text: '主页', link: '/'},
      {text: '示例', link: '/markdown-examples'}
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          {text: '指南', link: '/guide'},
          {text: '技术指南', link: '/guide/guide-tech'}
        ]
      },
      {
        text: '挂职问题',
        items: [
          {
            text: '新人挂职问题',
            link: '/pages/qa/nominal-job'
          }
        ]
      },
      {
        text: '证件管理',
        items: [
          {
            text: '证件标准文档',
            link: '/pages/a/card-resource/add/standard_cert'
          }
        ]
      },
      {
        text: '审核管理',
        items: [
          {
            text: '匿名证件审核',
            link: '/pages/a/audit/anon-audit'
          }
        ]
      },
      {text: '职位管理', items: [{text: '添加职位', link: '/pages/a/job/add/add-job'}]},
      {
        text: '开发文档（除开发人员外无需查看）',
        items: [
          {text: 'Markdown 示例', link: '/dev/markdown-examples'},
          {text: 'pgsql 迁移大版本', link: '/dev/pgsql-migration'},
          {text: 'playwright docker 安装', link: '/dev/playwright-docker-install'},
          {text: '运行时 API 示例', link: '/dev/data-examples'},
          {text: 'JPA', link: '/dev/jpa'},
          {text: '微信公众号', link: '/dev/wxpa'}
        ]
      }
    ],
    socialLinks: [{icon: 'github', link: 'https://github.com/TrueNine'}],
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: '中文/简体',
      lang: 'zh-CN'
    }
  }
})
