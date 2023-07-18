<template>
  <div
    ref="iframeBox"
    :style="{
      width: props.width,
      height: props.height,
    }"
  >
    <iframe :src="src" :width="width" :height="height"></iframe>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
// import config from '@/assets/config'
import { navigateToPage } from '@/utils/jumper.ts'

const route = useRoute()
const iframeBox = ref()
const width = ref(0)
const height = ref(0)
// const patch = computed(() => {
//   if (route.path.includes(props.name || '')) {
//     return route.path
//   }
// })
const props = defineProps({
  url: String,
  query: Object,
  name: String,
  height: String,
  width: String,
})
const src = computed(() => {
  if (!route.path.includes(props.name as string)) {
    return ''
  }
  if (props.url) {
    let query = ''
    if (props.query && Object.keys(props.query).length) {
      query = new URLSearchParams(props.query).toString()
    }
    nextTick(() => {
      width.value = iframeBox.value.offsetWidth
      height.value = iframeBox.value.offsetHeight
    })

    if (import.meta.env.DEV) {
      return props.url + route.path + '?' + query
    } else {
      return window.location.origin + route.path + '?' + query
    }
  }
})
watch(
  () => route.params.pathName,
  (v) => {
    if (route.path.includes(props.name as string)) {
      navigateToPage(props.name as string, '/' + v, route.query)
    }
  },
  {
    immediate: true,
  }
)
window.addEventListener('resize', () => {
  nextTick(() => {
    width.value = iframeBox.value.offsetWidth
    height.value = iframeBox.value.offsetHeight
  })
})
</script>
