<template>
  <div>子页面3</div>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
watch(
  () => route.query,
  (v) => {
    console.log(v)
  }
)
</script>
