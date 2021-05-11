<template>
  <div class="g-header g-header-fixed">
    <div class="m-nav">
        <el-row type="flex" justify="space-between">
          <el-col :xs="4" :sm="4" :md="4">
            <nuxt-link to="/">
              <img src="@/assets/images/logo.png" height="40px">
            </nuxt-link>
          </el-col>
          <!--    <768px或<992px 占用格子设置为0   :xs="0" :sm="0"   -->
          <el-col class="hidden-sm-and-down" :md="10">
            <el-menu
              default-active="/"
              mode="horizontal"
              active-text-color="#303133"
              background-color="#fafafa"
              router>
              <el-menu-item index="/">博客</el-menu-item>
              <el-menu-item index="/question">问答</el-menu-item>
              <el-menu-item index="/label">标签</el-menu-item>
            </el-menu>
          </el-col>
          <el-col class="nav-right" :xs="18" :sm="18" :md="8">
            <div class="u-nav-sign">
              <el-button type="text">管理后台</el-button>
              <el-button v-if="!userInfo" type="text" @click="$store.dispatch('LoginPage')">登录</el-button>
              <el-button v-if="!userInfo" type="primary" @click="$store.dispatch('LoginPage')" size="small" round>注册</el-button>
            </div>
            <el-dropdown @command="handleCommand">
              <div class="el-dropdown-link">
                <el-avatar icon="el-icon-user-solid" :src="userInfo ? userInfo.imageUrl : null">
                </el-avatar>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="article">写文章</el-dropdown-item>
                <el-dropdown-item command="question">提问题</el-dropdown-item>
                <el-dropdown-item command="user">我的主页</el-dropdown-item>
                <el-dropdown-item v-if="userInfo" command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handleCommand(command) {
      if(! this.userInfo) {
        // 没有登录，跳转登录页
        return this.$store.dispatch('LoginPage')
      }
      switch (command){
        case 'article':
          // 以新窗口打开编辑文章窗口
          let routeData = this.$router.resolve('/article/edit')
          window.open(routeData.href, '_blank')
          break;
        case 'question':
          // 以新窗口打开编辑问题窗口
          routeData = this.$router.resolve('/question/edit')
          window.open(routeData.href, '_blank')
          break;
        default:
          break;
      }
      this.$message('点击了' + command);
    }
  }
}
</script>

<style scoped>
  /*.g-header{*/
  /*  width: 100%;*/
  /*  height: 60px;*/
  /*  background-color: #FAFAFA;*/
  /*  border-top: 3px solid #333333;*/
  /*  box-shadow: 0 2px 4px rgba(0, 0, 0, .12);*/
  /*  z-index: 1501;*/
  /*}*/

  /*.g-header-fixed{*/
  /*  position: fixed;*/
  /*}*/
    /* 头部 */
  .g-header {
    width: 100%;
    height: 60px;
    border-top: 3px solid #345dc2;
    background-color: #fafafa;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .12);
    z-index: 1501;
  }
  /* 固定头部 */
  .g-header-fixed {
    position: fixed;
  }
  /* 导航 */
  .g-header .m-nav {
    max-width: 1140px;
    /* 居中 */
    margin: auto;
    padding: 10px;
  }
  .el-menu.el-menu--horizontal {
    /* 去除底部边框 */
    border-bottom: 0px;
    margin-top: -10px;
  }
  /* 导航右侧 */
  .nav-right {
    text-align: right;
  }
  .u-nav-sign {
    position: absolute;
    right: 0;
    margin-right: 50px;
  }
  /* 防止点击头像有边框 */
  div:focus {
    outline: none;
  }

</style>
