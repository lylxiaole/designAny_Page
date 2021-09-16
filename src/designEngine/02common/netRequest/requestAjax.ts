import Vue from 'vue'
import store from '../store/index'
import { CurrentContext } from '../../01designerContext'
import { jsonlint } from './jsonlint'
import { Modal, notification } from 'ant-design-vue'
import { VueAxios } from '../utils/axios'
import { ACCESS_TOKEN, CompanyId, State_Info, Platform_Type } from '../store/mutation-types'
import { getUserInfo, encodeUnicode } from '@/utils/util'
import router from '../../../../router/index'

export default class ajaxRequest {
  public static ajaxpost_sync(url: string, data: any): any {
    var x = this.ajaxReq(url, 'post', false, data)
    return x
  }

  public static ajaxget_sync(url: string): any {
    // message.loading('数据请求中')
    var x = this.ajaxReq(url, 'get', false)
    // message.destroy()
    return x
  }

  private static ajaxReq(url: string, type: string, async: boolean, data?: any) {
    let result: any = null
    let errorMsg: any = null
    $.ajax({
      url: url,
      type: type,
      async: async,
      data: JSON.stringify(data),
      timeout: 12000,
      contentType: 'application/json',
      dataType: 'text',
      beforeSend: function(request) {
        let user = getUserInfo()
        let username = user.name === undefined ? undefined : encodeUnicode(user.name)
        let ApplicationCode = 'DesignWeb'

        if (
          !router.currentRoute.meta.corpid &&
          (!router['history'].pending || !router['history'].pending.meta || !router['history'].pending.meta.corpid)
        ) {
          ApplicationCode = 'DesignWeb'
        } else {
          ApplicationCode =
            router.currentRoute.meta.corpid && router.currentRoute.meta.appcode ? router.currentRoute.meta.appcode.toUpperCase() : 'AppWeb'
        }
        // window.console.log('当前企业Id', CurrentContext.GetCompanyId())
        request.setRequestHeader('Application-Code', ApplicationCode)
        request.setRequestHeader('User-Name', username)
        request.setRequestHeader('User-Id', user.id)
        request.setRequestHeader('Access-Token', CurrentContext.GetUserToken())
        request.setRequestHeader('Company-Id', CurrentContext.GetCompanyId())
        request.setRequestHeader('AppId', CurrentContext.AppID)
      },
      success: function(response) {
        //response = (jsonlint as any).parse(response)
        response = JSON.parse(response)
        if (response.code != '0') {
          // notification.warn({
          //   message: response.msg,
          //   description: '发生错误',
          //   duration: 4,
          // })
          errorMsg = '操作失败，返回码：' + response.code + '，' + response.msg
        } else {
          result = response.data
        }
      },
      // statusCode: function(res){

      // },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        // 状态码
        // window.console.log(XMLHttpRequest)
        // 状态
        // window.console.log(XMLHttpRequest.readyState)
        var err = XMLHttpRequest
        if (err) {
          let data = err
          //console.info('请求请求请求datadatadata', data)
          const token = Vue.ls.get(ACCESS_TOKEN)
          //console.log('------异常响应------', token)
          //console.log('------异常响应------', error.response.status)
          switch (XMLHttpRequest.status) {
            case 403:
              notification.warn({
                message: '系统提示',
                description: '拒绝访问',
                duration: 4,
              })
              break
            case 500:
              //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
              if (token && data.statusText == 'Token失效，请重新登录') {
                Modal.warning({
                  title: '登录已过期',
                  content: '很抱歉，登录已过期，请重新登录',
                  okText: '重新登录',
                  mask: false,
                  onOk: () => {
                    store.dispatch('Logout').then(() => {
                      Vue.ls.remove(ACCESS_TOKEN)
                      window.location.reload()
                    })
                  },
                })
              } else {
                notification.warn({
                  message: '系统提示',
                  description: '请求资源发生内部错误！',
                  duration: 4,
                })
              }
              break
            case 404:
              notification.warn({
                message: '系统提示',
                description: '很抱歉，资源未找到！',
                duration: 4,
              })
              break
            case 504:
              notification.warn({
                message: '系统提示',
                description: '网络超时',
              })
              break
            case 401:
              notification.warn({
                message: '系统提示',
                description: '未授权，请重新登录',
                duration: 4,
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
                description: data.statusText,
                duration: 4,
              })
              break
          }
        }
        return Promise.reject(err)
      },
    })

    if (errorMsg) {
      throw errorMsg
    }

    return result
  }
}
