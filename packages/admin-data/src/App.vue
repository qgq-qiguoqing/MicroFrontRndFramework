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
import { nextTick, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { routes } from '@/router/index'
import { navigateToPage } from './utils/index'
const router = useRouter()
const route = useRoute()
const include = ref<Array<string>>([])
const onGo = () => {
  // if (v == 1) {
  //   router.replace('/pageOne')
  // } else {
  //   router.replace('/pageTwo')
  // }
  navigateToPage('/pageThree')
}

watch(route, (v) => {
  if (v) {
    navigateToPage(v.path, v.query)
  }
})
function onGoPage(v: string, query: any) {
  let path = routes.map((e: any) => e.path)

  if (path.includes(v)) {
    router.replace({
      path: v,
      query,
    })
    let r = routes.filter((it) => it.path == v)[0].name as string
    if (!include.value.includes(r)) {
      include.value.push(r)
    }
  }
}
nextTick(() => {
  window.top?.addEventListener('navigateToOther', (e: any) => {
    if (e && e.detail) {
      if (e.detail.baseUrl && e.detail.baseUrl == 'vuePackage') {
        try {
          onGoPage(e.detail.url, e.detail.query)
        } catch (error) {
          console.log(error, 'error')
        }
      }
    }
  })
  window.top?.addEventListener('closeRoute', (e: any) => {
    if (e && e.detail) {
      if (e.detail.baseUrl && e.detail.baseUrl == 'vuePackage') {
        let r = routes.filter((it) => it.path == e.detail.url)[0]
        include.value = include.value.filter((it) => it != r.name)
      }
    }
  })
})

// onMounted(() => {

// })
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
