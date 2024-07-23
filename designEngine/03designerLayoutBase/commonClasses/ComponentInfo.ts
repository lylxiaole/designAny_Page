// *******************组件相关*******************************************************
export enum DCompType {
  /**系统组件 */
  system_component = 'system_component',
  /**组件模板 */
  component_template = 'component_template',
  /**功能组件 */
  functional_component = 'functional_component'
}
export class DCompInfo {
  constructor(_type: DCompType, _groupName: string, _name: string, _component: any, _icon: any, _platform: string, _compCode?: string) {
    this.type = _type
    this.groupName = _groupName
    this.name = _name
    this.component = _component
    this.icon = _icon
    this.compCode = _compCode
    this.platform = _platform
  }
  type: DCompType
  compCode: string
  groupName: string = ''
  name: string = ''
  component: any
  icon: any
  platform: string
}
/**设计器的组件 以索引形式保存 */
export class CompIndex {
  static indexs = {}
}
/**设计器的组件 以数组形式保存 */
export const allComponents: DCompInfo[] = []

/** */
export function findSystemCompByCode(code: string): any {
  var comp: any = CompIndex.indexs[code]
  comp.compCode = code
  return comp
}

export function DCompnentAttr(paltform: string, dCompType: DCompType, groupName: string, name: string, compCode: string, icon: any) {
  return function (target: Function) {
    !target.prototype.lyl_comp && (target.prototype.lyl_comp = {})

    // window.console.log('DCompnentAttr', target.prototype.lyl_comp, compCode)
    target.prototype.lyl_comp.dCompType = dCompType
    target.prototype.lyl_comp.groupName = groupName
    target.prototype.lyl_comp.name = name
    target.prototype.lyl_comp.compCode = compCode
    target.prototype.lyl_comp.icon = icon
    target.prototype.lyl_comp.paltform = paltform

    let layoutInfo = new DCompInfo(dCompType, groupName, name, target, icon, paltform, compCode)
    allComponents.push(layoutInfo)

    if (!CompIndex.indexs[compCode]) {
      CompIndex.indexs[compCode] = target
    }
  }
}

export function findOrginCompInfo(enginLayout) {
  if (!enginLayout.prototype || !enginLayout.prototype.lyl_comp) {
    return null
  }

  let find = allComponents.find((o) => o.component == enginLayout)

  if (!enginLayout) {
    return null
  }
  return find
}
