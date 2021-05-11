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
        console.log('响应拦截器：', response)
        return response
    })

    $axios.onError(error => {
        console.log('响应异常：', error.response.status)
    })
}
