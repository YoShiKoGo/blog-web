export default {

  env: {
    // 认证客户端URL，process.env.NODE_ENV
    authURL: process.env.NODE_ENV === 'dev' ? 'http://localhost:7000' : '//login.mengxuegu.com'
  },

  head: {
    title: '博客社区门户网',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'IT技术交流，java开发问答_前端问答' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/wen.ico' }
    ]
  },

  css: [
    //  全局引入样式
    // 针对element-ui 组件的各种样式
    'element-ui/lib/theme-chalk/index.css',
    // 自定义主题样式
    '~assets/theme/index.css',
    // 布局样式
    'element-ui/lib/theme-chalk/display.css',
    // 项目自定义全局样式
    '@assets/css/global.css',
    // mavon-editor编辑器使用的样式
    'mavon-editor/dist/css/index.css'
  ],

  plugins: [
    '~/plugins/element-ui.js',
    '~/plugins/interceptor.js',
    {src: '~/plugins/vue-mavon-editor.js', mode: 'client'}, // 只能在客户端使用，用到了window
    '~/api/article.js',
    '~/api/common.js',
    '~/api/question.js',
  ],

  components: true,

  buildModules: [
  ],

  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt', // 针对服务端操作cookie
  ],

  axios:  {
    proxy:  true, //  开启代理
    prefix: '/api',  // 请求接口添加前缀  /api -> /api/test
  },

  proxy:  { //代理转发
    '/api': { // /api/test -> https://mock.mengxuegu.com/mock/6073001f56076a4a76484460/blog-web/test
      target: 'https://mock.mengxuegu.com/mock/6073001f56076a4a76484460/blog-web',
      pathRewrite:  {'^/api': ''}
    }
  },

  build: {
    //  将位于 node_modules  目录下的element-ui导出
    transpile: [/^element-ui/],
    /*
      webpack自定义配置
     */
    extend(config, ctx){

    }
  }
}
