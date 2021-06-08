<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!--   左侧导航   -->
      <el-col class="hidden-sm-and-down" :md="3">
        <el-divider content-position="left">技术频道</el-divider>
        <el-menu
          :default-active="$route.path"
          active-text-color="#ffffff"
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">推荐</span>
          </el-menu-item>
          <el-menu-item v-for="item in categoryList" :key="item.id" :index="'/'+ item.id">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <!--   中间轮播图   -->
      <el-col :md="16">
        <div class="blog-center">
          <div class="banner">
            <el-carousel height="230px">
              <el-carousel-item v-for="item in mainAdvertList" :key="item.id">
                <a :href="item.advertUrl" :target="item.advertTarget">
                  <img :src="item.imageUrl">
                </a>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <!--    文章列表    -->
        <nuxt-child/>
      </el-col>

      <!--   右侧广告区域   -->
      <el-col class="hidden-sm-and-down" :md="5">
          <el-card class="right-card" shadow="hover" :body-style="{padding: '10px'}">
            <p>课程推荐</p>
            <el-carousel height="210px">
              <el-carousel-item v-for="item in courseAdvertList" :key="item.id">
                <a :href="item.advertUrl" :target="item.advertTarget">
                  <img :src="item.imageUrl">
                  <span>{{ item.title }}</span>
                </a>
              </el-carousel-item>
            </el-carousel>
          </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
export default {

  // async asyncData({$axios}) {
  //   // console.log('process.env.NODE_ENV', process.env.authURL)
  //   // 测试test
  //   console.log('测试')
  //   const resp = await $axios.$get('/test');
  //   // console.log(resp)
  // },

  async asyncData({app}) {
    // 1.查询技术频道
    const {data: categoryList} = await app.$getCategoryList();
    // console.log('categoryList', categoryList)
    // 2.查询滚动广告
    const {data: mainAdvertList} = await app.$getAdvertList(1);
    // 3.查询课程推荐广告
    const {data: courseAdvertList} = await app.$getAdvertList(2);
    return {categoryList, mainAdvertList, courseAdvertList}
  }

}
</script>

<style scoped>
  /*外部样式*/
  @import '@/assets/css/blog/index.css';
</style>
