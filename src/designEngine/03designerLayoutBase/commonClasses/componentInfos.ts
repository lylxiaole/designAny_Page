// *******************组件相关*******************************************************

export enum LayoutType {
  /**系统组件 */
  system_component = 'system_component',
  /**组件模板 */
  component_template = 'component_template',
  /**功能组件 */
  functional_component = 'functional_component'
}
export class LayoutInfo {
  constructor(_type: LayoutType, _groupName: string, _name: string, _component: any, _icon: any, _compCode?: string) {
    this.type = _type
    this.groupName = _groupName
    this.name = _name
    this.component = _component
    this.icon = _icon
    this.compCode = _compCode
  }
  type: LayoutType
  compCode: string
  groupName: string = ''
  name: string = ''
  component: any
  icon: any
}
/**设计器的组件 以索引形式保存 */
export class CompIndex {
  static indexs = {}
}
/**设计器的组件 以数组形式保存 */

export const allComponents: LayoutInfo[] = []

/** */
export function findSystemCompByCode(code: string): any {
  var comp: any = CompIndex.indexs[code].component
  comp.compCode = code
  return comp
}

export function layoutCompTypeAttr(paltform: string, layoutType: LayoutType, groupName: string, name: string, compCode: string, icon: any) {
  return function(target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.layoutType = layoutType
    target.prototype.$Meta.groupName = groupName
    target.prototype.$Meta.name = name
    target.prototype.$Meta.compCode = compCode
    target.prototype.$Meta.icon = icon
    target.prototype.$Meta.paltform = paltform
    // window.console.log('类型访问器:', target)
  }
}

/**动态读取propertyGrid Cell组件 */
const modulesFiles = require.context('./', true, /\.(vue)$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  if (value.default.$Meta && value.default.$Meta.compCode) {
    CompIndex.indexs['compCode'] = value.default
    let metadata = value.default.$Meta
    let layoutInfo = new LayoutInfo(metadata.layoutType, metadata.groupName, metadata.name, value.default, metadata.icon)
    allComponents.push(layoutInfo)
  }

  return modules
}, {})
// *******************组件相关*******************************************************
