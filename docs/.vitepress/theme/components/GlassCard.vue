<template>
  <div class="glass-card" :class="{ 'hover-effect': hoverable }">
    <div class="card-header">
      <div class="tool-icon">
        <img :src="icon" :alt="title" />
      </div>
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <p class="card-description">{{ description }}</p>
    <div class="card-footer">
      <a :href="link" class="card-link">
        了解更多 →
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  title: String,
  description: String,
  link: String,
  hoverable: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-card.hover-effect:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.tool-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.tool-icon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.tool-icon img {
  width: 24px;
  height: 24px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.card-description {
  color: #a1a1aa;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.card-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.card-link:hover {
  color: #2563eb;
}

/* 悬停效果 */
.glass-card.hover-effect:hover .tool-icon {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glass-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .tool-icon {
    width: 40px;
    height: 40px;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
}
</style>
