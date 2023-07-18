<template>
  <div class="h-full w-full p-3 overflow-hidden" id="iframeBox" ref="rootBox">
    <div
      :style="{
        display: isShow.main ? 'block' : 'none',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }"
    >
      <RouterView v-slot="{ Component }">
        <transition name="fade">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </transition>
      </RouterView>
    </div>
    <div
      key="blog"
      id="blog"
      :style="{
        display: isShow.blog ? 'block' : 'none',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }"
    ></div>

    <div
      key="admin"
      id="admin"
      :style="{
        display: isShow.admin ? 'block' : 'none',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }"
    ></div>
    <div
      key="vuePackage"
      id="vuePackage"
      :style="{
        display: isShow.vuePackage ? 'block' : 'none',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import config from '@/assets/config'
import { navigateToPage } from '@/utils/jumper.ts'
// import { routes } from './router/index.ts'

const router = useRouter()
const route = useRoute()
const isShow = reactive<any>({
  main: true,
  blog: false,
  vuePackage: false,
  admin: false,
})
const rootBox = ref()

// 根据路由跳转 来判断是否需要显示子应用 创建iframe标签后不在销毁 保留在内存中
function onGo(p: string, v: string, actions?: string) {
  let url = import.meta.env.DEV ? config[p] : '' // 环境地址
  let reactBox: any = document.getElementById(p)
  if (reactBox && !reactBox.children.length) {
    if (rootBox.value) {
      var iframe = document.createElement('iframe')
      iframe.src = url + p + '/' + v
      iframe.width = rootBox.value?.offsetWidth
      iframe.height = rootBox.value?.offsetHeight
      reactBox?.appendChild(iframe)
      iframe.onload = function () {
        navigateToPage(
          p,
          actions ? '/' + v + '/' + actions : '/' + v,
          route.query
        )
      }
    }
  } else {
    navigateToPage(p, actions ? '/' + v + '/' + actions : '/' + v, route.query)
  }
}
// 不使用watch监听路由变化，使用钩子就需要初始化的时候进行一次手动的跳转
onMounted(() => {
  if (route.params.package) {
    for (const key in isShow) {
      isShow[key] = false
    }
    let p = route.params.package as string
    isShow[p] = true
    onGo(
      route.params.package as string,
      route.params.pathName as string,
      route.params.action as string
    )
  } else {
    router.push(route.path)
  }
})
router.beforeEach((v) => {
  if (v.params && v.params.pathName) {
    for (const key in isShow) {
      isShow[key] = false
    }
    let p = v.params.package as string
    isShow[p] = true
    console.log(v, '路由信息')
    nextTick(() => {
      onGo(
        v.params.package as string,
        v.params.pathName as string,
        v.params.action as string
      )
    })
  } else {
    for (const key in isShow) {
      isShow[key] = false
    }
    isShow.main = true
  }
})

// 监听页面的尺寸变化动态修改iframe的宽高
window.addEventListener('resize', () => {
  // nextTick(() => {
  if (rootBox.value.offsetWidth) {
    let width = rootBox.value.offsetWidth
    let height = rootBox.value.offsetHeight
    let iframeBox = document.getElementById('iframeBox')
    let iframeS = iframeBox?.getElementsByTagName('iframe')
    if (iframeS) {
      for (let i = 0; i < iframeS.length; i++) {
        iframeS[i].width = width
        iframeS[i].height = height
      }
    }
  }

  // })
})
</script>
