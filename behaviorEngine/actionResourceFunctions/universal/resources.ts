import { getUuid } from '@common/utils'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import axios from 'axios'

@resourceFuncAttr('字典', '', funcGroup.universalTool, funcCode.dictionary, funcStack.universal, [], { key: getUuid(), name: '输出' })
export class dictionarys implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior

  async excute(inparams: object_InParam[]) {
    let key = this.currentActObj.resourceFilter.dicKey

    let dic = behaviorContext.allDictionary.find((o) => o.key === key)
    return dic.value
  }
}

@resourceFuncAttr('外部接口', '', funcGroup.universalTool, funcCode.thirtyApi, funcStack.universal, [], { key: getUuid(), name: '输出' })
export class thirtyApis implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior

  async excute(inparams: object_InParam[]) {
    //
    let apiInfo = this.currentActObj.resourceFilter.apiInfo
    let header = {}
    let body = {}
    let urlParam = {}

    for (let index = 0; index < inparams.length; index++) {
      const inParam = inparams[index]
      if (inParam.key.indexOf('&body') > -1 && apiInfo.bodyIsParam && apiInfo.requestType !== 'Get') {
        let key = inParam.key.split('&')[1]
        body[key] = inParam.val
      } else if (inParam.key.indexOf('&body') > -1 && !apiInfo.bodyIsParam && apiInfo.requestType !== 'Get') {
        body = inParam.val
      } else if (inParam.key.indexOf('&param') > -1) {
        let key = inParam.key.split('&')[1]
        urlParam[key] = inParam.val
      } else if (inParam.key.indexOf('&header') > -1) {
        let key = inParam.key.split('&')[1]
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

    let response = await axios.request({
      //请求类型
      method: requestType,
      //URL
      url: url,
      headers: header,
      params: urlParam,
      //设置请求体(即传输的数据)
      data: body
    })

    return response.data
  }
}

@resourceFuncAttr('单条件判断', '', funcGroup.universalTool, funcCode.oneParamJude, funcStack.universal, [{ key: getUuid(), name: '入参' }], { key: getUuid(), name: '输出' }, true)
export class oneParamJude implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let inparamVal = inparams[0].val
    let judeParam = this.currentActObj.resourceFilter.judeParam
    let judeVal = this.currentActObj.resourceFilter.judeVal
    let js = inparamVal + judeParam + judeVal
    let res = eval(js)
    return res
  }
}

@resourceFuncAttr('固定值', '', funcGroup.universalTool, funcCode.fixedVal, funcStack.universal, [], { key: getUuid(), name: '输出' })
export class fixedValue implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let type = this.currentActObj.resourceFilter.type
    let value = this.currentActObj.resourceFilter.value

    if (type === 'bool') {
      return Boolean(value)
    } else if (type === 'string') {
      return value.toString()
    } else if (type === 'number') {
      return parseFloat(value)
    }
  }
}
