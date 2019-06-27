import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'
import 'nprogress/nprogress.css'
import JSONbig from 'json-bigint'

Vue.use(ElementUI)
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

axios.defaults.transformResponse = [function (data) {
  // data 是未经处理的后端响应数据：JSON 格式字符串
  // Do whatever you want to transform the data

  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (typeof response.data === 'object') {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  console.log(error)
  const status = error.response.status
  if (status === 401) {
    window.localStorage.removeItem('user_info')
    router.push({ name: 'login' })
  }
  return Promise.reject(error)
})

Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
