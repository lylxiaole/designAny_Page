import Vue from 'vue'
import axios from 'axios'
import { Modal, message, notification, Spin } from 'ant-design-vue'
import { jsonlint } from './jsonlint'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 6000, // 请求超时时间
  transformResponse: [
    function(data) {
      // return getRealJsonData(data)
      return jsonlint.parse(data)
    },
  ],
})
// axios 默认不发送cookie，需要全局设置true发送cookie
// service.defaults.withCredentials = true

const err = (error) => {
  return Promise.reject(error)
}

// response interceptor
service.interceptors.response.use((response) => {
  let data = response.data
  // window.console.info('interceptors', data)
  if (data.data === null || data.data === undefined) {
    data.data = data.result ? data.result : null
  }
  if (data.code != undefined && data.code != '0' && data.msg != undefined) {
    data.message = '操作失败，' + data.code + data.msg != undefined ? ':' + data.msg : ''
  }
  return data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  },
}

export { installer as VueAxios, service as axios }
