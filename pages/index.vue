<template>
  <div class="container">
    <el-button type="primary">主要按钮</el-button>
    <div v-for="i in 1000" :key="i">
      {{i}} {{$store.state.userInfo}}
    </div>
  </div>
</template>

<script>
export default {

  async asyncData({$axios}) {
    // console.log('process.env.NODE_ENV', process.env.authURL)
    // 测试test
    console.log('测试')
    const resp = await $axios.$get('/test');
    // console.log(resp)
  },

}
</script>

<style>
</style>
