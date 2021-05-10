<template>
  <div class="container">
    <el-button type="primary">主要按钮</el-button>
    <div v-for="i in 1000" :key="i">
      {{i}}
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>
