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
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { closeRoute } from '@/utils/jumper.ts'
import { routes } from './router/index.ts'

const router = useRouter()
const route = useRoute()
let tabs = ref<any[]>([])
tabs.value = JSON.parse(window.localStorage.getItem('tabs') || '[]')
// 不管是子应用和主应用，统一使用这个跳转方法，记录跳转记录
function onGo(v: string) {
  router.push(v)
}
// tab栏的操作
function dealTabs(v: string, parent?: string) {
  let urls = tabs.value.map((e: any) => e.url)
  let n = urls.indexOf(v)
  if (n == -1) {
    let children = routes[0].children as any[]
    let r = children?.map((it) => it.path)
    let i = r?.indexOf(v)

    if (i > -1) {
      if (parent) {
        let j = urls.indexOf(parent)

        tabs.value.splice(j + 1, 0, {
          url: v,
          title: children[i]?.meta?.title,
        })
        setTabs(j + 1)
      } else {
        tabs.value.push({
          url: v,
          title: children[i]?.meta?.title,
        })
        setTabs(tabs.value.length - 1)
      }
    }
  } else {
    setTabs(n)
  }
}

router.afterEach((v) => {
  if (!v.params.pathName) {
    if (v.query.parent || v.params.parent) {
      let parent = (v.query.parent || v.params.parent) as string
      dealTabs(v.path, parent)
    } else {
      dealTabs(v.path)
    }
  }
})

function onTab(v: any, i: number) {
  router.push(v.url)
  setTabs(i)
}
function onClose(v: string, i: number) {
  let r = v.split('/').filter((it) => it)
  let len = tabs.value.length

  if (i === len - 1 && i != 0) {
    router.push(tabs.value[i - 1].url)
  } else if (i != 0) {
    router.push(tabs.value[i + 1].url)
  }
  tabs.value.splice(i, 1)
  if (tabs.value.length == 0) {
    router.push('/')
  }
  window.localStorage.setItem('tabs', JSON.stringify(tabs.value))

  closeRoute(r[0], '/' + r[1])
}
function setTabs(i: number) {
  tabs.value = tabs.value.map((it) => {
    it.activated = false
    return it
  })
  tabs.value[i].activated = true
  window.localStorage.setItem('tabs', JSON.stringify(tabs.value))
}
// 收集子应用发过来的路由信息 通知主应用改变浏览器地址
window.top?.addEventListener('message', (e) => {
  if (e.data.url) {
    let url = e.data.url.includes(e.data.origin)
      ? e.data.url
      : '/' + e.data.origin + e.data.url
    if (tabs.value.length) {
      let urls = tabs.value.map((e: any) => e.url)
      let i = urls.indexOf(route.path)
      tabs.value = tabs.value.map((it) => {
        it.activated = false
        return it
      })
      if (!urls.includes(url)) {
        if (e.data.parentUrl) {
          // 判断是否是页面的操作页面 如果是页面的操作页面则根据父页面的url判断位置，添加
          let parentUrl = ''
          if (route.path.includes(e.data.origin)) {
            parentUrl = e.data.parentUrl
          } else {
            parentUrl = '/' + e.data.origin + e.data.parentUrl
          }
          let j = urls.indexOf(parentUrl)
          j > -1 &&
            tabs.value.splice(j + 1, 0, {
              url: url,
              title: e.data.title,
              query: e.data.query,
              activated: true,
            })
        } else {
          tabs.value.push({
            url: url,
            title: e.data.title,
            query: e.data.query,
            activated: true,
          })
        }
      } else if (tabs.value[i]) {
        tabs.value[i].activated = true
      }
    } else {
      tabs.value.push({
        url: url,
        title: e.data.title,
        query: e.data.query,
      })
    }
    window.localStorage.setItem('tabs', JSON.stringify(tabs.value))
    if (route.path !== e.data.url && !route.path.includes(e.data.url)) {
      router.replace({
        path: url,
        query: e.data.query,
      })
    }
  }
})
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
