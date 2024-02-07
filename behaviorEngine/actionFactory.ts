import { deepClone } from '@common/utils'
import { EnginePage, EngineLayout } from '@designEngine/index'
import { behavior, actionDetail, action } from './behaviorTypes'

import { objectBase, object_FixedVal, object_Method, object_Signs, object_Variable, objectType } from './actObject'

import { actFuncBase, resourceFuncAttr, resourceType, funcStack, resourceGroup, getFuncObjByType, getFuncByType } from './actFuncBase'

export class factory {
  public currentLayout: EngineLayout
  public currentPage: EnginePage
  public currentBehavior: behavior
  constructor(_layout: EngineLayout, _page: EnginePage, _behavior: behavior) {
    this.currentLayout = _layout
    this.currentPage = _page
    this.currentBehavior = _behavior
  }
  /********制造object*************************************************** */
  public makeObject(resType: resourceType): objectBase {
    let obj: objectBase = getFuncObjByType(resType)

    this.makeFuncToObj(obj, resType)
    return obj
  }
  public makeFuncToObj(obj: objectBase, resType: resourceType) {
    var func = getFuncByType(resType)
    func.currentBehavior = this.currentBehavior
    func.currentLayout = this.currentLayout
    func.currentPage = this.currentPage
    func.$meta = obj

    obj.setValFunction = (obj: objectBase, val: any) => {
      func.setFunc(obj, val)
    }
    obj.getValFunction = (obj: objectBase) => {
      var res = func.getFunc(obj)
      if (res) {
        obj = null
        return deepClone(res)
      } else {
        return res
      }
    }
    obj.getDescFunction = (obj: objectBase) => {
      return func.getDesc(obj)
    }
  }

  /********执行行为*************************************************** */
  public exacteAction() {
    if (!this.currentBehavior) {
      return
    }
    window.console.log('*****************执行行为***********************', this.currentBehavior.name)
    try {
      for (let index = 0; index < this.currentBehavior.actions.length; index++) {
        let action = this.currentBehavior.actions[index]
        this.excuteActionDetail(action)
      }
    } catch (error) {
      if (error == undefined) {
        throw error
      }
      if (error == '') {
        return
      }
    }
    this.currentBehavior.inparam = {}
    this.currentBehavior.variables = []
  }

  private excuteActionDetail(act: action): boolean {
    if (act.judgingCondition && act.judgingCondition.length > 0) {
      var isThrough = this.excuteObjs(act.judgingCondition)
      if (isThrough != true) {
        window.console.warn('*****************不执行动作:' + act.name + ',因为判断条件未通过***********************')
        return
      }
    }
    window.console.warn('*****************执行动作:' + act.name + '***********************')
    for (let index = 0; index < act.actionDetails.length; index++) {
      let actd = act.actionDetails[index]
      if ((actd as actionDetail).isActionDetail) {
        window.console.warn('*****************执行动作细节：' + actd.name + '***********************')
        this.excuteObjs((actd as actionDetail).objs)
      } else {
        this.excuteActionDetail(actd as action)
      }
    }
  }
  private weakm = new WeakMap()
  private excuteObjs(objs: objectBase[]): any {
    this.weakm.set(this, {})
    let _runArea = this.weakm.get(this)
    let evalStr = ''

    for (let index = 0; index < objs.length; index++) {
      let obj = objs[index]
      _runArea[index] = obj
      evalStr += '_runArea[' + index + '].ref'
      // if (obj.objType == objectType.signs) {
      //   evalStr += obj.ref
      // } else if (obj.resourceType == resourceType.pageSources) {
      //   let pageId = obj.resourceId
      //   let param = []
      //   let inputParams = (obj as any).inputParams
      //   for (var m = 0; m < inputParams.length; m++) {
      //     param.push({
      //       key: inputParams[m].key,
      //       name: inputParams[m].name,
      //       paramVal: inputParams[m].obj.objType == objectType.fixedVal ? inputParams[m].obj.ref : inputParams[m].obj.ref.data
      //     })
      //   }
      //   let run_param = { pageId: pageId, param: param }
      //   _runArea[index] = run_param
      //   evalStr += '_runArea[' + index + ']'
      // } else {
      //   _runArea[index] = obj
      //   evalStr += '_runArea[' + index + '].ref'
      // }
    }

    try {
      return eval(evalStr)
    } catch (error) {
      if (error == '' || error == undefined) {
        throw error
      }

      window.console.error('执行行为细节出错', error)
    } finally {
      evalStr = null
      this.weakm.delete(this)
      this.weakm = new WeakMap()
      _runArea = null
    }
  }
}
