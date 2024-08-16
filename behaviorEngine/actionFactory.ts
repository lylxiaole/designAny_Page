import { deepClone } from '@common/utils'
import { EnginePage, EngineLayout } from '@designEngine/index'
import { behavior, actionDetail, action } from './behaviorTypes'
import { findFlowNodeInner, anchorType } from './flowDesigner/flowTypes'

import { actionObj } from './actObject'
import { actFuncBase, resourceFuncAttr, funcCode } from './actFuncBase'
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
  public getObjFunc(obj: actionObj): actFuncBase {
    var func = getFuncByType(obj.funcCode)
    func.currentBehavior = this.currentBehavior
    func.currentLayout = this.currentLayout
    func.currentPage = this.currentPage
    func.currentActObj = obj

    return func
  }

  public fillFuncToObj(obj: actionObj, funcCode: funcCode) {
    var func = getFuncByType(funcCode)
    func.currentBehavior = this.currentBehavior
    func.currentLayout = this.currentLayout
    func.currentPage = this.currentPage
    func.currentActObj = obj
  }
  /********执行行为*************************************************** */
  public async exacteAction() {
    if (!this.currentBehavior) {
      return
    }
    //初始化
    for (let index = 0; index < this.currentBehavior.actObjs.length; index++) {
      const element = this.currentBehavior.actObjs[index]
      element.excuted = false
    }
    //顶级流程节点
    let topActObjs = this.currentBehavior.actObjs.filter((o) => !o.preObjIds || o.preObjIds.length < 1)
    this.excuteChildObjs(null, topActObjs)
  }

  private async excuteChildObjs(parentObj: actionObj, childObjs: actionObj[]) {
    for (let index = 0; index < childObjs.length; index++) {
      const childObj = childObjs[index]
      if (!parentObj) {
        //子级节点没有上级，子级可以直接执行
        let childObj_func = this.getObjFunc(childObj)
        let res = await childObj_func.excute()
        if (childObj.outParam) {
          childObj.outParam.val = res
        }
        childObj.excuted = true
        //执行完成,进行下一次递归
        let child_childObjs = this.currentBehavior.actObjs.filter((o) => childObj.nextObjIds.indexOf(o.id) > -1)
        await this.excuteChildObjs(childObj, child_childObjs)
      } else if (parentObj && parentObj.isJudeNode) {
        //上级节点是判断节点.判断节点没有参数，所以要用preObjIds对应关系
        let judgeRes = parentObj.outParam.val
        let preObjId = null
        if (judgeRes === true) {
          preObjId = parentObj.id + '_yes'
        } else {
          preObjId = parentObj.id + '_no'
        }
        if (childObj.preObjIds.indexOf(preObjId) > -1) {
          //上级节点是判断节点.判断的结果不与子级的任何入参对接。所以不需要等待所有入参都具备，可以直接执行子级
          let childObj_func = this.getObjFunc(childObj)
          let res = await childObj_func.excute()
          childObj.excuted = true
          if (childObj.outParam) {
            childObj.outParam.val = res
          }
          let child_childObjs = this.currentBehavior.actObjs.filter((o) => childObj.nextObjIds.indexOf(o.id) > -1)
          await this.excuteChildObjs(childObj, child_childObjs)
        }
      } else {
        //子级如果有入参，需要把上级的出参赋值给子级的入参
        let inParam = childObj.inputParams.find((o) => o.refOutParamId === parentObj.outParam.key)
        inParam.val = parentObj.outParam.val

        //如果子级的所有上级都执行完成,可以开始执行子级
        let allParents = this.currentBehavior.actObjs.filter((o) => childObj.preObjIds.indexOf(o.id) > -1)
        let noExcutedParent = allParents.find((o) => o.excuted === false)
        if (!noExcutedParent) {
          let childObj_func = this.getObjFunc(childObj)
          let res = await childObj_func.excute()
          childObj.excuted = true
          if (childObj.outParam) {
            childObj.outParam.val = res
          }
          //执行完成,进行下一次递归
          let child_childObjs = this.currentBehavior.actObjs.filter((o) => childObj.nextObjIds.indexOf(o.id) > -1)
          await this.excuteChildObjs(childObj, child_childObjs)
        }
      }
    }
  }
}
