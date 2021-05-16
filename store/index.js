// 定义状态，nxut中声明state必须是function
import da from "element-ui/src/locale/lang/da";

const state = () => ({
  userInfo: null, // 用户信息对象
  accessToken: null, // 访问令牌字符串
  refreshToken: null, // 刷新令牌字符串
})

// 改变状态值
const mutations = {
  // 重置用户状态
  RESET_USER_STATE(state) {
    // 状态置空
    state.userInfo = null
    state.accessToken = null
    state.refreshToken = null
  },

  // 更新用户状态
  UPDATE_ALL_STATE(state, data) {
    state.userInfo = data.userInfo
    state.accessToken = data.accessToken
    state.refreshToken = data.refreshToken
  }
}

// 定义行为
const actions = {

  // nuxt提供的，每次发送请求都会调用此方法，而且第一个参数store,该方法的第二个参数是context,
  nuxtServerInit({commit}, {app}) {
    console.log('nuxtServerInit')
    const data = {}
    data.userInfo = app.$cookies.get('userInfo');
    data.accessToken = app.$cookies.get('accessToken');
    data.refreshToken = app.$cookies.get('refreshToken');
    console.log('data', data)
    // 更新用户状态
    commit('UPDATE_ALL_STATE', data)

  },

  // 跳转登录页
  LoginPage({commit}) { // 不要少了花括号{commit}
    // 重置用户状态
    commit('RESET_USER_STATE')
    // 跳转登录页，redirectURL 引发跳转到登录页的URL
    window.location.href =
      `${process.env.authURL}?redirectURL=${window.location.href}`
  },

  // 登出
  UserLogout({commit}) {
    // 重置状态
    commit('RESET_USER_STATE')
    // 跳转认证客户端
    window.location.href = `${process.env.authURL}/logout?redirectURL=${window.location.href}`

  }

}

// 导出
export default {
  state,
  mutations,
  actions
}
