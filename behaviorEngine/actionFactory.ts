import { deepClone } from '@common/utils'
import { EnginePage, EngineLayout } from '@designEngine/index'
import { behavior, actionDetail, action } from './behaviorTypes'

import { actionObj } from './actObject'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from './actFuncBase'
import { getFuncObjByType, getFuncByType } from './actResource'

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
  public makeObject(funcCode: funcCode): actionObj {
    let obj: actionObj = getFuncObjByType(funcCode)
    this.fillFuncToObj(obj, funcCode)
    return obj
  }

  public cloneObject(oldObj: actionObj): actionObj {
    let newobj: actionObj = Object.assign({}, oldObj)
    this.fillFuncToObj(newobj, oldObj.funcCode)
    return newobj
  }
  public fillFuncToObj(obj: actionObj, funcCode: funcCode) {
    var func = getFuncByType(funcCode)
    func.currentBehavior = this.currentBehavior
    func.currentLayout = this.currentLayout
    func.currentPage = this.currentPage
    func.currentActObj = obj

    obj.setFunc = async (obj: actionObj, val: any) => {
      await func.setFunc(obj, val)
    }
    obj.getFunc = async (obj: actionObj) => {
      var res = await func.getFunc(obj)
      if (res) {
        obj = null
        return deepClone(res)
      } else {
        return res
      }
    }
    obj.getDesc = (obj: actionObj) => {
      return func.getDesc(obj)
    }
  }
  /********执行行为*************************************************** */
  public async exacteAction() {
    if (!this.currentBehavior) {
      return
    }

    let topActObjs = this.currentBehavior.actObjs.filter((o) => !o.preObjIds || o.preObjIds.length < 1)
    for (let index = 0; index < topActObjs.length; index++) {
      const actObj = topActObjs[index] as actionObj
      let newActObj = this.cloneObject(actObj) as actionObj
      let result = newActObj.ref
      if (actObj.outParam) {
        actObj.outParam.val = result
      }
      let childObjs = this.currentBehavior.actObjs.filter((o) => actObj.nextObjIds.indexOf(o.id) > -1)
      await this.excuteChildObjs(actObj, childObjs)
    }
  }

  private async excuteChildObjs(parentObj: actionObj, childObjs: actionObj[]) {
    for (let index = 0; index < childObjs.length; index++) {
      const childObj = childObjs[index]

      for (let jndex = 0; jndex < childObj.inputParams.length; jndex++) {
        const inparam = childObj.inputParams[jndex]
        if (parentObj.outParam && parentObj.outParam.key === inparam.refOutParamId) {
          inparam.val = parentObj.outParam.val
        }
      }
      // *********入参是否都具备了值，如果有入参没具备值，暂时先不执行*********
      let childObj_NoVal_Params = childObj.inputParams.filter((o) => !o.val)
      if (childObj_NoVal_Params.length > 0) {
        continue
      }
      // 入参 都具备了值，可以开始执行
      let newActObj = this.cloneObject(childObj) as actionObj
      let result = newActObj.ref
      if (newActObj.outParam) {
        childObj.outParam.val = result
      }

      let child_childObjs = this.currentBehavior.actObjs.filter((o) => childObj.nextObjIds.indexOf(o.id) > -1)
      await this.excuteChildObjs(childObj, child_childObjs)
    }
  }

  // private async excuteActionDetail(act: action): Promise<boolean> {
  //   if (act.judgingCondition && act.judgingCondition.length > 0) {
  //     var isThrough = await this.excuteObjs(act.judgingCondition)
  //     if (isThrough != true) {
  //       window.console.warn('*****************不执行动作:' + act.name + ',因为判断条件未通过***********************')
  //       return
  //     }
  //   }
  //   window.console.warn('*****************执行动作:' + act.name + '***********************')
  //   for (let index = 0; index < act.actionDetails.length; index++) {
  //     let actd = act.actionDetails[index]
  //     if ((actd as actionDetail).isActionDetail) {
  //       window.console.warn('*****************执行动作细节：' + actd.name + '***********************')
  //       await this.excuteObjs((actd as actionDetail).objs)
  //     } else {
  //       await this.excuteActionDetail(actd as action)
  //     }
  //   }
  // }
  // private weakm = new WeakMap()
  // private async excuteObjs(objs: actionObj[]): Promise<any> {
  //   this.weakm.set(this, {})
  //   let _runArea = this.weakm.get(this)
  //   let evalStr: string[] = []

  //   for (let index = 0; index < objs.length - 1; index++) {
  //     //当前
  //     let currentObj = objs[index]
  //     let newObj = this.makeObject(currentObj.funcCode)
  //     newObj.cloneFrom(currentObj)
  //     _runArea[index] = newObj
  //     //下一个
  //     let nextObj = objs[index + 1]
  //     //判断
  //     if (nextObj.objType === objectType.signs && nextObj.funcCode === funcCode.signAssign) {
  //       evalStr.push('_runArea[' + index + '].ref')
  //     } else {
  //       let val = await newObj.ref
  //       _runArea[index] = val
  //       evalStr.push('_runArea[' + index + ']')
  //     }
  //     //最后一个元素
  //     if (index === objs.length - 2) {
  //       let lastObj = objs[index + 1]
  //       newObj = this.makeObject(lastObj.funcCode)
  //       newObj.cloneFrom(lastObj)
  //       let val = await newObj.ref
  //       _runArea[index] = val
  //       evalStr.push('_runArea[' + index + ']')
  //     }
  //   }

  //   try {
  //     return eval(evalStr.join(''))
  //   } catch (error) {
  //     if (error == '' || error == undefined) {
  //       throw error
  //     }
  //     window.console.error('执行行为细节出错', error)
  //   } finally {
  //     evalStr = null
  //     this.weakm.delete(this)
  //     this.weakm = new WeakMap()
  //     _runArea = null
  //   }
  // }
}
