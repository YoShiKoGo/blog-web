<template>
  <div>
    <el-tabs value="hot" type="card" @tab-click="handleClick">
      <el-tab-pane label="热门回答" name="hot">
        <list-view
          name="hot"
          :list-data="this.listData"
          :page="this.page"
          @fetch-data="fetchData"
        />
      </el-tab-pane>
      <el-tab-pane label="最近回答" name="new">
        <list-view
          name="new"
          :list-data="this.listData"
          :page="this.page"
          @fetch-data="fetchData"
        />
      </el-tab-pane>
      <el-tab-pane label="等待回答" name="wait">
        <list-view
          name="wait"
          :list-data="this.listData"
          :page="this.page"
          @fetch-data="fetchData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListView from '@/components/question/List.vue'
export default {
  components:{
    ListView
  },
  methods:{
    // 点击标签tab，查询当前tab的第一页
    handleClick(tab){
      console.log(tab.paneName)
      this.fetchData(tab.paneName, 1)
    },
    // 获取分页数据(标签名，当前页码)
    async fetchData(paneName, current){
      // 分页查询数据
      this.page.current = current
      // 查询结果
      let res = null
      switch (paneName) {
        case 'hot':
          res = await this.$getHotList(this.page)
          break;
        case 'new':
          res = await this.$getNewList(this.page)
          break;
        case 'wait':
          res = await this.$getWaitList(this.page)
          break;
        default:
          break;
      }

      if(res && res.code === 20000){
        // 更新总记录数
        this.page.total = res.data.total
        // 更新列表数据
        this.listData = res.data.records
      }
    }
  },

  async asyncData({app}){
    const page = {
      total: 0,// 总记录数
      current:1,// 当前页码
      size: 20,// 每页显示20条数据
    }
    const {data} = await app.$getHotList(page);
    // 赋值总记录数
    page.total = data.total
    console.log('data',data)
    return {page, listData: data.records}
  }

}
</script>

<style scoped>

</style>
