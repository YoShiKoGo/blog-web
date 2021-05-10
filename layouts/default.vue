<template>
  <div>
    <!--  头部  -->
    <main-header/>
    <!--中间主题区域-->
    <div class="g-main">
      <Nuxt />
    </div>
    <!--  底部  -->
    <Footer/>
    <!-- 回到顶部组件 bottom 是图标距离底部高度 -->
    <el-backtop :bottom="80"></el-backtop>
  </div>
</template>
<script>
  import MainHeader from "@/components/layout/MainHeader";
  import Footer from "@/components/layout/Footer";
  export default {
    components: {
      MainHeader,
      Footer
    },
  }
</script>
<style>
  .g-main{
    padding-top: 90px;
    max-width: 1140px;
    margin: 0 auto;
  }

</style>
