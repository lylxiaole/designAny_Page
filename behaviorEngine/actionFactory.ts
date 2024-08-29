import { deepClone } from '@common/utils'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/index'
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
    await this.excuteChildObjs(null, topActObjs)
  }

  private async excuteChildObjs(parentObj: actionObj, childObjs: actionObj[]) {
    for (let index = 0; index < childObjs.length; index++) {
      const currentObj = childObjs[index]
      if (!parentObj) {
        //子级节点没有上级，子级可以直接执行
        let childObj_func = this.getObjFunc(currentObj)
        let res = await childObj_func.excute([])
        if (currentObj.outParam) {
          currentObj.outParam.val = res
        }
        currentObj.excuted = true
        //执行完成,进行下一次递归
        let child_childObjs = this.currentBehavior.actObjs.filter((o) => currentObj.nextObjIds.indexOf(o.id) > -1)
        await this.excuteChildObjs(currentObj, child_childObjs)
      } else if (parentObj && parentObj.isJudeNode) {
        if (parentObj.outParam) {
          //上级如果是的判断节点，那就采用判断节点的上级出参，作为入参
          let inParam = currentObj.inputParams.find((o) => o.refOutParamId === parentObj.outParam.key)
          let parentParentObj = this.currentBehavior.actObjs.find((o) => parentObj.preObjIds.indexOf(o.id) > -1)
          if (parentParentObj.outParam) {
            //判断节点的上级必有返回值
            if (inParam && inParam.valueFilter) {
              inParam.val = this.cuteFilterVal(parentParentObj.outParam.val, inParam.valueFilter)
            } else if (inParam) {
              inParam.val = parentParentObj.outParam.val
            } else {
            }
          }
        }
        //上级节点是判断节点.判断的结果不与子级的任何入参对接。所以不需要等待所有入参都具备，可以直接执行子级
        let childObj_func = this.getObjFunc(currentObj)
        let usefulInparams = currentObj.inputParams.filter((o) => o.refOutParamId)
        let res = await childObj_func.excute(usefulInparams)
        currentObj.excuted = true
        if (currentObj.outParam) {
          currentObj.outParam.val = res
        }
        let child_childObjs = this.currentBehavior.actObjs.filter((o) => currentObj.nextObjIds.indexOf(o.id) > -1)
        await this.excuteChildObjs(currentObj, child_childObjs)
      } else {
        if (parentObj.outParam) {
          //子级如果有入参，上级有出参，需要把上级的出参赋值给子级的入参
          let inParam = currentObj.inputParams.find((o) => o.refOutParamId === parentObj.outParam.key)
          if (inParam && inParam.valueFilter) {
            inParam.val = this.cuteFilterVal(parentObj.outParam.val, inParam.valueFilter)
          } else if (inParam) {
            inParam.val = parentObj.outParam.val
          } else {
          }
        }

        //如果子级的所有上级都执行完成,可以开始执行子级
        let allParents = this.currentBehavior.actObjs.filter((o) => currentObj.preObjIds.indexOf(o.id) > -1)
        let noExcutedParent = allParents.find((o) => o.excuted === false)
        if (noExcutedParent) {
          continue
        }
        let childObj_func = this.getObjFunc(currentObj)
        let usefulInparams = currentObj.inputParams.filter((o) => o.refOutParamId)
        let res = await childObj_func.excute(usefulInparams)
        currentObj.excuted = true

        if (currentObj.outParam) {
          currentObj.outParam.val = res
        }

        let child_childObjs = []
        //执行完成,进行下一次递归
        if (currentObj.isJudeNode && res == true) {
          let currengObjId = currentObj.id + '_yes'
          child_childObjs = this.currentBehavior.actObjs.filter((o) => o.preObjIds.indexOf(currengObjId) > -1)
        } else if (currentObj.isJudeNode && res == false) {
          let currengObjId = currentObj.id + '_no'
          child_childObjs = this.currentBehavior.actObjs.filter((o) => o.preObjIds.indexOf(currengObjId) > -1)
        } else {
          let currengObjId = currentObj.id
          child_childObjs = this.currentBehavior.actObjs.filter((o) => o.preObjIds.indexOf(currengObjId) > -1)
        }
        await this.excuteChildObjs(currentObj, child_childObjs)
      }
    }
  }

  private cuteFilterVal(val, filter: string) {
    let filters = filter.split('.')
    let res = val
    for (let index = 0; index < filters.length; index++) {
      const filterx = filters[index]
      res = res[filterx]
    }
    return res
  }
}
