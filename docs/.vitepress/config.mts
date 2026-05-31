import { defineConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI Agent Lab',
  description: '面向 AI Agent 的攻略教学与实战指南',
  base: '/ai-hub/',

  head: [
    ['link', { rel: 'icon', href: '/ai-hub/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' }],
  ],

  theme: {
    extends: DefaultTheme,
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AI Agent Lab',
    darkMode: true,

    nav: [
      { text: '首页', link: '/' },
      { text: '入门指南', link: '/guide/what-is-ai-agent' },
      {
        text: '工具教程',
        items: [
          { text: 'Claude Code', link: '/claude-code/' },
          { text: 'OpenClaw', link: '/openclaw/' },
          { text: 'Cursor', link: '/cursor/' },
          { text: 'Windsurf', link: '/windsurf/' },
        ]
      },
      { text: '资源汇总', link: '/resources/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '什么是 AI Agent', link: '/guide/what-is-ai-agent' },
            { text: '快速上手', link: '/guide/getting-started' },
          ]
        }
      ],
      '/claude-code/': [
        {
          text: 'Claude Code',
          items: [
            { text: '概览', link: '/claude-code/' },
            { text: '安装配置', link: '/claude-code/install' },
            { text: '基础用法', link: '/claude-code/basics' },
            { text: '高级技巧', link: '/claude-code/advanced' },
            { text: '实战案例', link: '/claude-code/workflows' },
            { text: '常见问题', link: '/claude-code/faq' },
          ]
        }
      ],
      '/cursor/': [
        {
          text: 'Cursor',
          items: [
            { text: '概览', link: '/cursor/' },
          ]
        }
      ],
      '/windsurf/': [
        {
          text: 'Windsurf',
          items: [
            { text: '概览', link: '/windsurf/' },
          ]
        }
      ],
      '/openclaw/': [
        {
          text: 'OpenClaw',
          items: [
            { text: '概览', link: '/openclaw/' },
            { text: '安装部署', link: '/openclaw/install' },
            { text: '配置详解', link: '/openclaw/config' },
            { text: '插件开发', link: '/openclaw/plugins' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yang-TimXin' }
    ],

    footer: {
      message: 'AI Agent 攻略教学',
      copyright: `© ${new Date().getFullYear()} Timyang`
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/Yang-TimXin/ai-hub/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
  },

  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    lineNumbers: true
  },
})
