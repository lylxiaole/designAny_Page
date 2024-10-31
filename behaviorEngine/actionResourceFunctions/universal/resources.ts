import { getUuid } from '@common/utils'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import axios from 'axios'
import excuteJS from '@common/components/commonComponents/funcstrExcute'
import { JSFuncEntity, JSFuncGroupDC, AddOrUpdateFunc } from '@common/apis/designJSFunc'
import funcStack from '@design-any/interface/dist/enums/funcStack'

@resourceFuncAttr('Dictionary', '', funcGroup.universalTool, funcCode.dictionary, funcStack.universal, [], { key: getUuid(), name: 'output' })
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

@resourceFuncAttr('Http Api', '', funcGroup.universalTool, funcCode.thirtyApi, funcStack.universal, [], { key: getUuid(), name: 'output' })
export class thirtyApis implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior

  async excute(inparams: object_InParam[]) {
    debugger
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
    debugger
    return response.data
  }
}

@resourceFuncAttr('Single condition judgment', '', funcGroup.universalTool, funcCode.oneParamJude, funcStack.universal, [{ key: getUuid(), name: 'inParam' }], { key: getUuid(), name: 'output' }, true)
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

@resourceFuncAttr('Fixed Value', '', funcGroup.universalTool, funcCode.fixedVal, funcStack.universal, [], { key: getUuid(), name: 'output' })
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

@resourceFuncAttr('JS Func', '', funcGroup.universalTool, funcCode.jsFunction, funcStack.universal, [], null)
export class jsFunction implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let funcId = this.currentActObj.resourceFilter.funcId
    let func = this.loopFindFunc(funcId, behaviorContext.allJSFuncs)
    if (!func || !func.content) {
      throw 'function does not exist'
    }

    let excutejs = new excuteJS(func.content)
    var params: any[] = []
    inparams.filter((o) => {
      params.push(o.val)
    })

    let res = excutejs.startExcute(params)

    return res
  }

  private loopFindFunc(targetId: string, allfuncs: JSFuncGroupDC[]) {
    for (let index = 0; index < allfuncs.length; index++) {
      const group = allfuncs[index]

      let find = group.childrenFuncs.find((o) => o.id === targetId)
      if (find) {
        return find
      }
      find = this.loopFindFunc(targetId, group.childrenGroups)
      if (find) {
        return find
      }
    }
    return null
  }
}
