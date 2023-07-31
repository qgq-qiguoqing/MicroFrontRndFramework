<template>
  <div class="flex w-full h-full">
    <button @click="onGo">page3</button>

    <div class="flex-1 min-w-min">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="include">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { navigateToPage } from './utils/index'
import { keepRoute } from './utils/dealRouter'

const { include, addEvent } = keepRoute()
const onGo = () => {
  navigateToPage('/pageThree')
}
addEvent()
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
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
<style>
.campusB .el-icon-arrow-right {
  font-size: 19px;
}
</style>
