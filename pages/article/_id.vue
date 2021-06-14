<template>
  <div>
    <el-row type="flex" >
      <!--  左  -->
      <el-col :md="18" :xs="24" :sm="24">
        <div class="article-left">
          <el-card>
            <!--  标题  -->
            <div class="article-title">
              <h1>{{data.title}}</h1>
              <div class="article-count">
                <nuxt-link :to="`/user/${data.userId}`" target="_blank" class="nickname">
                  <i class="el-icon-user-solid"></i> {{ data.nickName }}
                </nuxt-link>
                <span>
                  <i class="el-icon-data"></i> {{ getDateFormat(data.updateDate) }}
                  <i class="el-icon-thumb"></i> {{ data.thumhup }}
                  <i class="el-icon-view"></i> {{ data.viewCount }}
                </span>
              </div>
              <el-tag style="margin-left: 5px" v-for="item in data.labelList" :key="item.id" size="small">{{ item.name }}</el-tag>
            </div>
            <!--文章内容-->
            <div class="article-content">
              <div class="markdown-body" v-html="data.htmlContent"></div>
            </div>

            <el-button @click="handleThumb" icon="el-icon-thumb" type="primary" size="medium" :plain = "!isThumb">
              赞
            </el-button>
          </el-card>
          <div>
            <h2>评论区</h2>
            <!--      未登录      -->
            <el-card v-if="!$store.state.userInfo">
              <h4>登录后参与交流、获取后续更新提醒</h4>
              <div>
                <el-button @click="$store.dispatch('LoginPage')" type="primary" size="small">登录</el-button>
                <el-button @click="$store.dispatch('LoginPage')" type="primary" size="small" plain>注册</el-button>
              </div>
            </el-card>
            <!--    登录过        -->
            <el-card>
              <comment :user-id="userId"
                       :user-image="userImage"
                       :author-id="data.userId"
                       :show-comment="$store.state.userInfo ? true:false"
                       :comment-list="commentList"
                       @doSend="doSend"
                       @doChildSend="doChildSend"
                       @doRemove="doRemove"
              >

              </comment>
            </el-card>
          </div>
        </div>
      </el-col>
      <!--  右   -->
      <el-col class="hidden-sm-and-down" :md="5">
        <el-row>
          <el-col>
            <affix :offset="80">
              <directory parent-class="article-content"></directory>
            </affix>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 高亮显示样式
import '@/assets/css/md/github-markdown.css'
import '@/assets/css/md/github-min.css'
import {dateFormat} from '@/utils/date.js'
// 固钉
import affix from '@/components/common/Affix/index.vue'
// 文章目录
import directory from '@/components/common/Directory/index.vue'
// 评论组件
import comment from '@/components/common/Comment'


export default {
  components: {
    affix,
    directory,
    comment
  },
  // 校验id为数值才可以访问
  validate({params}) {
    return /^\d+$/.test(params.id)
  },
  head(){
    return {
      title: this.data.title // 浏览器中的标题
    }
  },
  data() {
    return {
      // 是否点赞
      isThumb: this.$cookies.get(`article-thumb-${this.$route.params.id}`) || false,
      // 当前登录用户id
      userId: this.$store.state.userInfo && this.$store.state.userInfo.uid,
      // 当前用户登录头像
      userImage: this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
      commentList: []
    }
  },

  methods: {
    getDateFormat(date) {
      return dateFormat(date)
    },
    // 点赞
    async handleThumb() {
      // 取消或者点赞
      this.isThumb = !this.isThumb
      // 1->点赞，-1->取消点赞
      const count = this.isThumb ? 1 :-1;
      // 文章id
      const articleId = this.$route.params.id
      const {code} = await this.$updateArticleThumb(articleId, count)
      if(20000 === code){
        // 更新当下点赞数
        this.data.thumhup = this.data.thumhup+count
        // 保存cookie，永久保存
        this.$cookies.set(`article-thumb-${this.$route.params.id}`, this.isThumb, {
          maxAge: 60*60*24*356*5 //五年
        })
      }
    },
    // 发布评论
    doSend(content) {
      console.log('发布评论',content)
      this.doChildSend(content)

    },
    // 回复评论
    doChildSend(content, parentId="-1") {
      console.log('回复评论(回复内容,父评论id)',content, parentId)
      const data = {
        content,
        parentId,
        articleId: this.$route.params.id,
        userId: this.userId,
        userImage: this.userImage,
        nickName: this.$store.state.userInfo && this.$store.state.userInfo.nickName
      }
      this.$addComment(data).then(response=> {
        // 新增评论成功
        if(20000 === response.code){
          // 刷新评论列表
          this.refreshComment()
        }
      })
    },
    // 删除评论
    async doRemove(id) {
      console.log('删除评论id=', id)
      const {code} = await this.$deleteComment(id)
      if(20000 === code){
        // 删除成功,刷新
        this.refreshComment()
      }
    },
    // 刷新评论
    async refreshComment(){
      const {data} = await this.$getCommentListByArticleId(this.$route.params.id)
      this.commentList = data
    }
  },

  async asyncData({params, app}){
    // 查询文章详情
    const {data} = await app.$getArticleById(params.id)
    // 更新文章浏览数
    // 1.如果cookie存在此文章id则不更新浏览数，不存在则更新
    // 2.浏览器关闭将此文章cookie的值删除，再次打开访问浏览数+1
    const isView = app.$cookies.get(`article-view-${params.id}`)
    if(!isView){
      // false
      const {code} = await app.$updateArticleViewCount(params.id)
      if(20000 === code){
        // 浏览数+1
        data.viewCount++
        // 保存cookie, 关闭浏览器cookie失效
        app.$cookies.set(`article-view-${params.id}`,true)
      }
    }

    // 通过文章id查询评论列表信息
    const {data: commentList} = await app.$getCommentListByArticleId(params.id)
    return {data, commentList}
  }
}
</script>

<style scoped>
@import '@/assets/css/blog/article.css';
</style>
