// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './agent-logos.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ ctx, app, router, siteData }) {
    // 在客户端运行时替换功能卡片的 emoji 为官方 logo
    if (typeof window !== 'undefined') {
      // 等待 DOM 加载完成
      const replaceIcons = () => {
        const features = document.querySelectorAll('.VPFeature')
        if (features.length === 0) return

        const logoMap = {
          'Claude Code': '/ai-hub/logos/claude-code-official.png',
          'OpenClaw': '/ai-hub/logos/openclaw.svg',
          'Cursor': '/ai-hub/logos/cursor.png',
          'Windsurf': '/ai-hub/logos/windsurf.svg'
        }

        features.forEach(feature => {
          const titleEl = feature.querySelector('.title')
          const iconEl = feature.querySelector('.icon')
          if (!titleEl || !iconEl) return

          const title = titleEl.textContent.trim()
          if (logoMap[title]) {
            // 隐藏 emoji 文字
            iconEl.style.fontSize = '0'
            iconEl.style.color = 'transparent'
            // 添加 logo 图片
            iconEl.style.backgroundImage = `url('${logoMap[title]}')`
            iconEl.style.backgroundSize = 'contain'
            iconEl.style.backgroundRepeat = 'no-repeat'
            iconEl.style.backgroundPosition = 'center'
            iconEl.style.width = '48px'
            iconEl.style.height = '48px'
            iconEl.style.borderRadius = '12px'
          }
        })
      }

      // 首次执行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceIcons)
      } else {
        replaceIcons()
      }

      // 路由变化后重新执行（VitePress 是 SPA）
      router.afterEach(() => {
        setTimeout(replaceIcons, 100)
      })
    }
  }
}
