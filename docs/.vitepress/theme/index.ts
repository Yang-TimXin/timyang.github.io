// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './agent-logos.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 自定义增强（纯 CSS 方案，不使用 Vue 组件）
  }
}
