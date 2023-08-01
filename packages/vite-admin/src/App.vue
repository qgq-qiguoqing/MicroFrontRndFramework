<template>
  <div class="flex w-full h-full">
    <div class="w-60 h-full flex flex-col flex-shrink-0">
      <button @click="onGo('/page1')">页面1</button>
      <!-- 这需要接口支持不然打开报错 -->
      <!-- <button @click="onGo('/blog/home')">博客</button>
      <button @click="onGo('/admin/article')">博客管理</button> -->
      <button @click="onGo('/vuePackage/pageOne')">子页面1</button>
      <button @click="onGo('/vuePackage/pageTwo')">子页面2</button>
    </div>
    <div class="flex-1 overflow-hidden">
      <div
        className="flex items-center shadow-md overflow-x-auto w-full "
        style="margin: 0; padding: 10px"
        v-if="tabs.length"
      >
        <el-tag
          class="mr-2 cursor-pointer"
          closable
          v-for="(e, i) in tabs"
          :type="e.activated ? '' : 'info'"
          :key="e.url"
          @click="onTab(e, i)"
          @close="onClose(e.url, i)"
        >
          {{ e.title }}</el-tag
        >
      </div>
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dealRoute } from './utils/dealRoute'

const { tabs, onGo, onTab, onClose, addWatch } = dealRoute()
addWatch()
</script>
<style scoped>
.header_box {
  position: fixed;
  top: 0;
  width: 100%;
  line-height: 60px;
  z-index: 99;
  background-color: hsla(0, 0%, 100%, 0.65);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
</style>
