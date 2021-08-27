import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // window.console.log('请求开始之前', store)
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['token'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    window.console.log('接口请求信息', response.request)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.msg && res.msg.indexOf('sessionId not') > -1) {
        return Promise.reject(new Error(res.msg || 'Error'))
      }
      if (response.request.responseURL.indexOf('unregister') > -1 || response.request.responseURL.indexOf('playbackstatus') > -1) {
        return Promise.reject(new Error(res.msg || 'Error'))
      }
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // window.console.error('数据请求错误:', response)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      let resdatalist = []

      // window.console.log('request success')

      for (const key in res) {
        let linshi = {}
        if (key !== 'code' && key !== 'requestid' && key !== 'msg' && key !== 'requestId') {
          linshi[key] = res[key]
          resdatalist.push(linshi)
        }
      }

      if (resdatalist.length == 1) {
        return resdatalist[0][Object.keys(resdatalist[0])[0]]
      }

      return res
    }
  },
  (error) => {
    window.console.log('err', error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
