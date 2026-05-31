// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HeroSection from './components/HeroSection.vue'
import GlassCard from './components/GlassCard.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('HeroSection', HeroSection)
    app.component('GlassCard', GlassCard)
  }
}
