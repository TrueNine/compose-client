<template>
<!-- 顶部导航栏 -->
<div class="flex items-center justify-between bg-white px-4 py-2 shadow-sm">
  <div class="text-lg font-bold">
    移动端原型
  </div>
  <div class="flex items-center space-x-2">
    <button class="i-carbon-notification text-xl" />
    <button class="i-carbon-user-avatar-filled text-xl" />
  </div>
</div>

<!-- 搜索框 -->
<div class="bg-gray-50 px-4 py-2">
  <input
    type="text"
    placeholder="搜索内容"
    class="w-full border border-gray-200 rounded-full bg-white px-4 py-2 text-sm focus:outline-none"
  />
</div>

<!-- 轮播图 -->
<div class="px-4 py-2">
  <div class="relative h-40 w-full overflow-hidden rounded-xl">
    <img src="https://picsum.photos/400/160?1" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute bottom-2 right-2 flex space-x-1">
      <span class="h-2 w-2 rounded-full bg-white/80" />
      <span class="h-2 w-2 rounded-full bg-white/40" />
      <span class="h-2 w-2 rounded-full bg-white/40" />
    </div>
  </div>
</div>

<!-- 功能区 -->
<div class="grid grid-cols-4 gap-4 px-4 py-2">
  <div class="flex flex-col items-center">
    <div class="i-carbon-home rounded-full bg-blue-100 p-2 text-2xl text-blue-500" />
    <span class="mt-1 text-xs">首页</span>
  </div>
  <div class="flex flex-col items-center">
    <div class="i-carbon-calendar rounded-full bg-green-100 p-2 text-2xl text-green-500" />
    <span class="mt-1 text-xs">日历</span>
  </div>
  <div class="flex flex-col items-center">
    <div class="i-carbon-chat rounded-full bg-yellow-100 p-2 text-2xl text-yellow-500" />
    <span class="mt-1 text-xs">消息</span>
  </div>
  <div class="flex flex-col items-center">
    <div class="i-carbon-settings rounded-full bg-purple-100 p-2 text-2xl text-purple-500" />
    <span class="mt-1 text-xs">设置</span>
  </div>
</div>

<!-- 列表区 -->
<div class="px-4 py-2">
  <div class="mb-2 flex items-center rounded-xl bg-white p-4 shadow">
    <img src="https://picsum.photos/48/48?2" class="mr-4 h-12 w-12 rounded-lg" />
    <div class="flex-1">
      <div class="font-medium">
        列表项标题1
      </div>
      <div class="mt-1 text-xs text-gray-400">
        这里是描述信息
      </div>
    </div>
    <button class="i-carbon-chevron-right text-lg text-gray-300" />
  </div>
  <div class="mb-2 flex items-center rounded-xl bg-white p-4 shadow">
    <img src="https://picsum.photos/48/48?3" class="mr-4 h-12 w-12 rounded-lg" />
    <div class="flex-1">
      <div class="font-medium">
        列表项标题2
      </div>
      <div class="mt-1 text-xs text-gray-400">
        这里是描述信息
      </div>
    </div>
    <button class="i-carbon-chevron-right text-lg text-gray-300" />
  </div>
  <div class="mb-2 flex items-center rounded-xl bg-white p-4 shadow">
    <img src="https://picsum.photos/48/48?4" class="mr-4 h-12 w-12 rounded-lg" />
    <div class="flex-1">
      <div class="font-medium">
        列表项标题3
      </div>
      <div class="mt-1 text-xs text-gray-400">
        这里是描述信息
      </div>
    </div>
    <button class="i-carbon-chevron-right text-lg text-gray-300" />
  </div>
  <!-- 新增列表项，方便滚动测试 -->
  <div v-for="i in 17" :key="i" class="mb-2 flex items-center rounded-xl bg-white p-4 shadow">
    <img :src="`https://picsum.photos/48/48?${i + 4}`" class="mr-4 h-12 w-12 rounded-lg" />
    <div class="flex-1">
      <div class="font-medium">
        列表项标题{{ i + 3 }}
      </div>
      <div class="mt-1 text-xs text-gray-400">
        这里是描述信息
      </div>
    </div>
    <button class="i-carbon-chevron-right text-lg text-gray-300" />
  </div>
</div>

<!-- 底部导航栏 -->
<div class="fixed bottom-0 left-0 z-10 h-14 w-full flex items-center justify-around border-t border-gray-200 bg-white">
  <button class="flex flex-col items-center text-blue-500">
    <span class="i-carbon-home text-xl" />
    <span class="text-xs">首页</span>
  </button>
  <button class="flex flex-col items-center text-gray-400">
    <span class="i-carbon-calendar text-xl" />
    <span class="text-xs">日历</span>
  </button>
  <button class="flex flex-col items-center text-gray-400">
    <span class="i-carbon-chat text-xl" />
    <span class="text-xs">消息</span>
  </button>
  <button class="flex flex-col items-center text-gray-400">
    <span class="i-carbon-settings text-xl" />
    <span class="text-xs">设置</span>
  </button>
</div>
</template>
