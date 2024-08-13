import { getUuid } from '@common/utils'
import { EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { actionObj } from '../../actObject'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import axios from 'axios'

@resourceFuncAttr('字典', '', funcGroup.pageOption, funcCode.dictionary, funcStack.webpc)
export class dictionarys implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {
    let key = this.currentActObj.resourceFilter.dicKey
    let dic = behaviorContext.allDictionary.find((o) => o.key === key)
    return dic.value
  }
}

@resourceFuncAttr('外部接口', '', funcGroup.pageOption, funcCode.thirtyApi, funcStack.webpc)
export class thirtyApis implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {
    let apiInfo = this.currentActObj.resourceFilter.apiInfo
    let inParams = this.currentActObj.inputParams

    let header = {}
    let body = {}
    let urlParam = {}

    for (let index = 0; index < inParams.length; index++) {
      const inParam = inParams[index]
      if (inParam.key.indexOf('&body') > -1 && apiInfo.bodyIsParam && apiInfo.requestType !== 'Get') {
        let key = inParam.key.split('&')[0]
        body[key] = inParam.val
      } else if (inParam.key.indexOf('&body') > -1 && !apiInfo.bodyIsParam && apiInfo.requestType !== 'Get') {
        body = inParam.val
      } else if (inParam.key.indexOf('&param') > -1) {
        let key = inParam.key.split('&')[0]
        urlParam[key] = inParam.val
      } else if (inParam.key.indexOf('&header') > -1) {
        let key = inParam.key.split('&')[0]
        header[key] = inParam.val
      }
    }

    let url = ''
    if (apiInfo.hostIsDictionary) {
      let dic = behaviorContext.allDictionary.find((o) => o.key === apiInfo.host)
      url = dic.value + apiInfo.path
    } else {
      url = apiInfo.host + apiInfo.path
    }
    let requestType = apiInfo.requestType

    return await axios.request({
      //请求类型
      method: requestType,
      //URL
      url: url,
      headers: header,
      params: urlParam,
      //设置请求体(即传输的数据)
      data: body
    })
  }
}
