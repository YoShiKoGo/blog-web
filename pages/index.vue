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

  asyncData() {
    console.log('process.env.NODE_ENV', process.env.authURL)
  },

}
</script>

<style>
</style>
