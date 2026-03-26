<template>
  <div class="home-page">
    <h1>@truenine/ui 组件库</h1>
    <p>Vue Router 5 文件路由已启用</p>
    <div class="nav-links">
      <RouterLink to="/components" class="nav-link">查看组件</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.nav-links {
  margin-top: 2rem;
}

.nav-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.nav-link:hover {
  background: #66b1ff;
}
</style>
