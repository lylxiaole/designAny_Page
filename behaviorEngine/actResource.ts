import { allActFunctions, funcGroup, funcCode } from './actFuncBase'
import { actionObj } from './actObject'
import { getUuid } from '@common/utils'

export class object_group {
  key: string //node节点的key
  title: string //node节点的标题
  childrenObjs: actionObj[] = [] //node节点的子级,有可能是
  childrenGroups: object_group[] = []
}

//actFunc转actObj
export function funcToObj(actFunc: any): actionObj {
  var obj = new actionObj()
  obj.id = getUuid()
  obj.name = actFunc.prototype.$lyl_actFunc.name
  obj.funcCode = actFunc.prototype.$lyl_actFunc.funcCode
  obj.description = actFunc.prototype.$lyl_actFunc.desc
  obj.inputParams = actFunc.prototype.$lyl_actFunc.inparams
  obj.outParam = actFunc.prototype.$lyl_actFunc.outParam
  obj.resourceFilter = {}
  return obj
}
//根据方法的信息，把方法的元数据组织成树结构，提供给设计器使用
export function getFuncObjsTree() {
  let res = [] //object_group
  for (let index = 0; index < allActFunctions.length; index++) {
    const actFunc = allActFunctions[index]
    let group = actFunc.prototype.$lyl_actFunc.funcGroup
    let findGroup = res.find((o) => o.title === group)
    if (!findGroup) {
      findGroup = new object_group()
      findGroup.key = getUuid()
      findGroup.title = group
      findGroup.childrenGroups = []
      findGroup.childrenObjs = []
      res.push(findGroup)
    }

    let actObj = funcToObj(actFunc)
    findGroup.childrenObjs.push(actObj)
  }
  return res
}
//获取指定类型的方法元数据
export function getFuncObjByGroup(group: funcGroup) {
  let funcs = allActFunctions.filter((o: any) => o.prototype.$lyl_actFunc.funcGroup == group)
  let objs = []
  for (let index = 0; index < funcs.length; index++) {
    const element = funcs[index]
    objs.push(funcToObj(element))
  }
  return objs
}

export function getFuncByType(funcCode: funcCode) {
  // window.console.log('行为代码2', funcCode)
  var res = allActFunctions.find((o: any) => o.prototype.$lyl_actFunc.funcCode == funcCode)
  try {
    return new res()
  } catch (error) {
    return null
  }
}
export function getFuncObjByType(funcCode: funcCode): actionObj {
  // window.console.log('行为代码2', funcCode)
  var res = allActFunctions.find((o: any) => o.prototype.$lyl_actFunc.funcCode == funcCode)
  try {
    return funcToObj(res)
  } catch (error) {
    return null
  }
}
