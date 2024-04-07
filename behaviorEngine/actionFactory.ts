import { deepClone } from '@common/utils'
import { EnginePage, EngineLayout } from '@designEngine/index'
import { behavior, actionDetail, action } from './behaviorTypes'

import { objectBase, object_FixedVal, object_Method, object_Signs, object_Variable, objectType } from './actObject'
import { actFuncBase, resourceFuncAttr, resourceCode, funcStack, resourceGroup, getFuncObjByType, getFuncByType } from './actFuncBase'

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
  public makeObject(resCode: resourceCode): objectBase {
    let obj: objectBase = getFuncObjByType(resCode)
    this.fillFuncToObj(obj, resCode)
    return obj
  }
  public fillFuncToObj(obj: objectBase, resCode: resourceCode) {
    var func = getFuncByType(resCode)
    func.currentBehavior = this.currentBehavior
    func.currentLayout = this.currentLayout
    func.currentPage = this.currentPage
    func.$meta = obj

    obj.setValFunction = async (obj: objectBase, val: any) => {
      await func.setFunc(obj, val)
    }
    obj.getValFunction = async (obj: objectBase) => {
      var res = await func.getFunc(obj)
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
  public async exacteAction() {
    if (!this.currentBehavior) {
      return
    }
    window.console.log('*****************执行行为***********************', this.currentBehavior.name)
    try {
      for (let index = 0; index < this.currentBehavior.actions.length; index++) {
        let action = this.currentBehavior.actions[index]
        await this.excuteActionDetail(action)
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
  private async excuteActionDetail(act: action): Promise<boolean> {
    if (act.judgingCondition && act.judgingCondition.length > 0) {
      var isThrough = await this.excuteObjs(act.judgingCondition)
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
        await this.excuteObjs((actd as actionDetail).objs)
      } else {
        await this.excuteActionDetail(actd as action)
      }
    }
  }
  private weakm = new WeakMap()
  private async excuteObjs(objs: objectBase[]): Promise<any> {
    this.weakm.set(this, {})
    let _runArea = this.weakm.get(this)
    let evalStr: string[] = []

    for (let index = 0; index < objs.length - 1; index++) {
      //当前
      let currentObj = objs[index]
      let newObj = this.makeObject(currentObj.resourceCode)
      newObj.cloneFrom(currentObj)
      _runArea[index] = newObj
      //下一个
      let nextObj = objs[index + 1]
      //判断
      if (nextObj.objType === objectType.signs && nextObj.resourceCode === resourceCode.signAssign) {
        evalStr.push('_runArea[' + index + '].ref')
      } else {
        let val = await newObj.ref
        evalStr.push(val)
      }
      //最后一个元素
      if (index === objs.length - 2) {
        let lastObj = objs[index + 1]
        newObj = this.makeObject(lastObj.resourceCode)
        newObj.cloneFrom(lastObj)
        let val = await newObj.ref
        evalStr.push(val)
      }
    }

    try {
      return eval(evalStr.join(''))
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
