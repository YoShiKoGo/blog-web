export default ({$axios}, inject) =>{

  // 查询技术频道
  inject('getCategoryList', ()=>$axios.$get('/article/api/category/list'))

  // 获取指定位置广告信息
  inject('getAdvertList', position=> $axios.$get(`/article/api/advert/show/${position}`))

  // 文章列表分页接口
  inject('getArticleList', query => $axios.$post(`/article/api/article/list`, query))

  // 查询文章详情
  inject('getArticleById', id => $axios.$get(`/article/api/article/${id}`))

  // 更新浏览数
  inject('updateArticleViewCount', id => $axios.$put(`/article/api/article/viewCount/${id}`))

  // 更新点赞数
  inject('updateArticleThumb', (articleId, count) => $axios.$put(`/article/article/thumb/${articleId}/${count}`))

  // 通过文章id查询评论列表
  inject('getCommentListByArticleId', articleId => $axios.$get(`/article/api/comment/list/${articleId}`))

  // 新增评论
  inject('addComment', data => $axios.$post(`/article/comment`, data))

  // 删除评论
  inject('deleteComment', id => $axios.$delete(`/article/comment/${id}`))

}
