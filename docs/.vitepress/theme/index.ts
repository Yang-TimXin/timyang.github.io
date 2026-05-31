// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './enhanced.css'
import './ultimate.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 自定义增强
  }
}
