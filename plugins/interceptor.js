export default({store, route, redirect, $axios}) =>{

    $axios.onRequest(config => {
        console.log("请求拦截器-----")
        const accessToken = store.state.accessToken;
        //  请求头添加token
        if(accessToken) {

          // Authorization: Bearer token(认证token)
          config.headers.authorization = 'Bearer ' + accessToken
        }
        return config
    })

    $axios.onResponse(response => {
        // console.log('响应拦截器：', response)
        console.log('响应拦截器')
        if(!store.state.accessToken){
          console.log('无accessToken')
          sendRefreshRequest(store,redirect, route)
        }
        return response
    })

    $axios.onError(error => {
        console.log('响应异常：', error.response.status)
        if(error.response.status !== 401){
            return Promise.reject(error)
        }

        // 401
        sendRefreshRequest(store, redirect, route)
        return Promise.reject('令牌过期，重新登录')
    })
}

// 防止并发重复提交刷新令牌，true：未发送；false：已发送
let isLock = true

const sendRefreshRequest = (store,redirect, route) =>{
    if(isLock && store.state.refreshToken){
        isLock = false
        // 发送请求到认证客户端，通过刷新令牌
        console.log('有刷新令牌，重新获取token',`${process.env.authURL}/refresh?redirectURL=${redirectURl(route)}`)
        redirect(`${process.env.authURL}/refresh?redirectURL=${redirectURl(route)}`)
    }else {
        isLock = true
        // 没有刷新令牌，则去登录页
      console.log('没有刷新令牌，则去登录页')
        store.commit('RESET_USER_STATE')
        // 跳转到登录页
        console.log('重定向',`${process.env.authURL}?redirectURL=${redirectURl(route)}`)
        redirect(`${process.env.authURL}?redirectURL=${redirectURl(route)}`)
    }
}

// 获取重定向地址
const redirectURl = (route)=>{
    // 客户端
    if(process.client) {
      return window.location.href
    }
    // 服务端 _AXIOS_BASE_URL_=> 域名+基础路径 http://localhost:3000/api
    return process.env._AXIOS_BASE_URL_.replace('/api', '') + route.path

}
