<template>
  <div class="hero-section">
    <div class="hero-background">
      <div class="particle" v-for="i in 20" :key="i"></div>
    </div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="text-gradient">AI Agent Lab</span>
      </h1>
      <p class="hero-subtitle">AI Agent 攻略教学</p>
      <p class="hero-description">从零掌握 AI Agent 工具，让 AI 成为你的得力助手</p>
      <div class="hero-actions">
        <a href="/guide/what-is-ai-agent" class="cta-button primary">
          🚀 开始学习
        </a>
        <a href="/claude-code/" class="cta-button secondary">
          📖 Claude Code 教程
        </a>
        <a href="/openclaw/" class="cta-button secondary">
          🦞 OpenClaw 教程
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// Hero 组件逻辑
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a24 100%);
  z-index: 0;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: pulse 8s ease-in-out infinite;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(odd) {
  animation-delay: -3s;
  background: rgba(139, 92, 246, 0.5);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 24px;
  max-width: 800px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 2rem;
  color: #a1a1aa;
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-description {
  font-size: 1.25rem;
  color: #71717a;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.cta-button.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
