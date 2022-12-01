export function layoutCompTypeAttr(paltform: string, layoutType: any, groupName: string, name: string, compCode: string, icon: any) {
  return function(target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    window.console.log('layoutCompTypeAttr', target.prototype.$Meta, compCode)
    target.prototype.$Meta.layoutType = layoutType
    target.prototype.$Meta.groupName = groupName
    target.prototype.$Meta.name = name
    target.prototype.$Meta.compCode = compCode
    target.prototype.$Meta.icon = icon
    target.prototype.$Meta.paltform = paltform
    // window.console.log('类型访问器:', target)
  }
}
