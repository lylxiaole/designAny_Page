import Vue from 'vue'
import axios from 'axios'
import { CurrentContext } from '../../01designerContext'
import store from '../store/index'
import { Modal, notification } from 'ant-design-vue'
import { encodeUnicode } from '../utils/util'
import { VueAxios } from '../utils/axios'
import { ACCESS_TOKEN, CompanyId, State_Info, Platform_Type } from '../store/mutation-types'
import { jsonlint } from './jsonlint'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 12000, // 请求超时时间
  transformResponse: [
    function(data) {
      if (data.indexOf('Proxy') === 0) {
        return data
      }

      //console.info('请求请求请求', data)
      // return getRealJsonData(data)
      return JSON.parse(response)
    }
  ]
})
// axios 默认不发送cookie，需要全局设置true发送cookie
// service.defaults.withCredentials = true

const err = (error) => {
  window.console.info('error.response', error.response)
  if (error.response) {
    let data = error.response.data
    window.console.info('请求请求请求datadatadata', data)
    const token = Vue.ls.get(ACCESS_TOKEN)
    //console.log('------异常响应------', token)
    //console.log('------异常响应------', error.response.status)
    switch (error.response.status) {
      case 403:
        notification.warn({
          message: '系统提示',
          description: '拒绝访问',
          duration: 4
        })
        break
      case 500:
        //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if (token && data.message == 'Token失效，请重新登录') {
          Modal.warn({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
        } else {
          notification.warn({
            message: '系统提示',
            description: '请求资源发生内部错误！',
            duration: 4
          })
        }
        break
      case 404:
        notification.warn({
          message: '系统提示',
          description: '很抱歉，资源未找到！',
          duration: 4
        })
        break
      case 504:
        notification.warn({
          message: '系统提示',
          description: '网络超时'
        })
        break
      case 401:
        notification.warn({
          message: '系统提示',
          description: '未授权，请重新登录',
          duration: 4
        })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.warn({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use((config) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  // const corpId = Vue.ls.get(CorpId)
  // if (corpId) {
  config.headers['Company-Id'] = CurrentContext.GetCompanyId() // 让每个请求携带自定义 corpId 请根据实际情况自行修改
  // }
  const user = Vue.ls.get(State_Info)
  const platformType = Vue.ls.get(Platform_Type)
  if (user && platformType !== undefined) {
    if (platformType === 0) {
      config.headers['User-Id'] = user.id
      config.headers['User-Name'] = encodeUnicode(user.corpName)
      config.headers['Application-Code'] = 'DesignWeb'
    } else {
      config.headers['User-Id'] = user.id
      config.headers['User-Name'] = encodeUnicode(user.name)
      config.headers['Application-Code'] = 'AppWeb'
    }
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const data = response.data

  if (data.data === null || data.data === undefined) {
    data.data = data.result ? data.result : null
  }
  // window.console.info('interceptors', data)
  if (data.code != undefined && data.code != '0' && data.msg != undefined) {
    data.message = '操作失败，返回码：' + data.code + '，' + data.msg
  }
  return data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
