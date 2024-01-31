import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs/",
  outDir: "docs",
  title: "产品使用文档",
  description: "有不懂得，记得先看看文档，能解决大部分问题",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "指南", link: "/guide" },
      { text: "主页", link: "/" },
      { text: "示例", link: "/markdown-examples" }
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "指南", link: "/guide" },
          { text: "技术指南", link: "/guide/guide-tech" }
        ]
      },
      {
        text: "审核管理",
        items: [
          {
            text: "匿名证件审核",
            link: "/pages/a/audit/anon-audit"
          }
        ]
      },
      {text: '职位管理',
      items: [
        {text: '添加职位',
        link: '/pages/a/job/add/add-job'
        }
      ]},
      {
        text: "示例（除开发人员外无需查看）",
        items: [
          { text: "Markdown 示例", link: "/markdown-examples" },
          { text: "运行时 API 示例", link: "/api-examples" }
        ]
      }
    ],
    socialLinks: [{ icon: "github", link: "https://gitee.com/TrueNine" }],
    search: {
      provider: "local"
    }
  },
  locales: {
    root: {
      label: "中文/简体",
      lang: "zh-CN"
    }
  }
});
