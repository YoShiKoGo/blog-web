export default ({$axios}, inject) => {
  // 热门回答
  inject('getHotList', page => $axios.$post('/question/api/question/hot', page))

  // 最新回答
  inject('getNewList', page => $axios.$post('/question/api/question/new', page))

  // 等待回答
  inject('getWaitList', page => $axios.$post('/question/api/question/wait', page))
}
