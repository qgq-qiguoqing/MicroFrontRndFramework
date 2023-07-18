<template>
  <div>
    页面1
    <!-- 用户信息 end -->
    <!-- <div class="currentCampus"> -->
    <!-- tab  -->

    <!-- </div> -->
    <!-- list -->

    <button @click="onGo">打开子页面2</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const tabList = [
  {
    title: '普通号',
    type: 0,
  },
  {
    title: '专家号',
    type: 1,
  },
  {
    title: '核酸号',
    type: 2,
  },
  {
    title: '儿科',
    type: 3,
  },
  {
    title: '儿科',
    type: 4,
  },
  {
    title: '儿科',
    type: 5,
  },
  {
    title: '核酸号',
    type: 6,
  },
]
// import { navigateToPage } from '@/utils/jumper.ts'

function onGo() {
  router.push({
    path: '/page2',
    query: {
      parent: '/page1',
    },
  })
}
</script>
<style scoped lang="postcss">
.tabWarp {
  width: 100%;
  height: 40px;

  background: #ffffff;
  box-sizing: border-box;
  padding: 9px 0 7px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 0px 22px 0px rgba(166, 169, 176, 0.2);
  overflow-x: auto;
  overflow-y: hidden;
  & div {
    width: 200px;
    flex-shrink: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .active {
      color: #35383e;
    }
    & p {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      color: #b7bcc5;
    }
    img {
      width: 12px;
      height: 4px;
    }
  }
}

& .listWarp {
  width: 343px;
  height: calc(100vh - 116px);
  overflow-y: auto;
  margin: 16px auto;
  box-shadow: 0px 0px 22px 0px rgba(166, 169, 176, 0.2);
  border-radius: 5px;
  box-sizing: border-box;
  padding: 4px 16px;
  & div {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #61646b;
    border-bottom: solid 1px #ebedf3;
    & img {
      width: 21px;
      height: 20px;
    }
  }
}
</style>
