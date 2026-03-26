<template>
  <div class="components-page">
    <h1>组件展示</h1>
    <div class="back-link">
      <RouterLink to="/">← 返回首页</RouterLink>
    </div>

    <section class="component-section">
      <h2>YIcon 图标</h2>
      <div class="demo-box">
        <YIco icon="mdi:home" size="2rem" />
        <YIco icon="mdi:account" size="2rem" color="#409eff" />
        <YIco icon="mdi:settings" size="2rem" color="#67c23a" />
      </div>
    </section>

    <section class="component-section">
      <h2>YPager 分页</h2>
      <div class="demo-box">
        <YPager v-model="page" :total="100" :page-size="10" />
      </div>
    </section>

    <section class="component-section">
      <h2>YFieldMessage 字段消息</h2>
      <div class="demo-box">
        <YFieldMessage error="这是错误提示" />
        <YFieldMessage success="这是成功提示" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { YIco, YPager, YFieldMessage } from '@truenine/ui'

const page = ref(1)
</script>

<style scoped>
.components-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1rem;
}

.back-link {
  margin-bottom: 2rem;
}

.back-link a {
  color: #409eff;
  text-decoration: none;
}

.component-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.component-section h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.demo-box {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
</style>
