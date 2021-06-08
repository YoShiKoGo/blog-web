<template>
  <div>
    <ul class="note-list">
      <li :class="{'have-img': item.imageUrl}" v-for="item in articleList" :key="item.id">
        <div class="content">
          <nuxt-link :to="`/article/${item.id}`" target="_blank">
            <p class="title">{{ item.title }}</p>
            <p class="abstract">{{item.summary}}</p>
          </nuxt-link>

          <div class="meta">
            <nuxt-link to="`/user/${item.userId}`" class="nickname">
              <i class="el-icon-user-solid" target="_blank"></i>  {{item.nickName}}
            </nuxt-link>
            <span>
              <i class="el-icon-thumb"></i>  {{item.thumhup}}
            </span>
            <span>
              <i class="el-icon-view"></i>  {{item.viewCount}}
            </span>
          </div>
          <div v-if="item.imageUrl">
            <!--      图片      -->
            <nuxt-link to="`/article/${item.id}`" class="wrap-img" target="_blank">
              <img :src="item.imageUrl">
            </nuxt-link>
          </div>
        </div>
      </li>
    </ul>

    <el-row type="flex" justify="center">
      <el-tag v-if="noMore" type="primary">没有更多数据……</el-tag>
      <el-button v-else @click="load" type="primary" :loading="loading"  size="small" round>
        {{loading ? "加载中……":"点击加载更多"}}
      </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  // 校验路由参数是否有效
  validate({params}){
    const id = params.id ? params.id : 0;
    // 必须是数值
    return /^\d+$/.test(id)
  },
  data(){
    return {
      loading: false, // 是否加载
      noMore: false //数据是否查询完毕，true没有数据，false还有数据
    }
  },
  methods: {
    // 点击按钮分页查询数据
    async load(){
      this.loading = true
      // 查询下一页
      this.query.current++
      const {data} = await this.$getArticleList(this.query)
      console.log(data)
      // 校验是否有数据
      if(data.records && data.records.length > 0){
        this.noMore = false
        // 将新数据追加到原有的数据中
        this.articleList = this.articleList.concat(data.records)
      }else {
        this.noMore = true
      }
      // 查询完成
      this.loading = false
    }
  },

  async asyncData({params, app}){
    // 分类id为空，表示推荐
    const categoryId = params.id ? params.id : null;

    // 查询文章列表
    const query = {categoryId, current: 1, size: 20}
    const {data} = await app.$getArticleList(query);
    // console.log('data',data)
    return {query, articleList: data.records}
  }
}
</script>

<style scoped>
@import '@/assets/css/blog/list.css';

</style>
