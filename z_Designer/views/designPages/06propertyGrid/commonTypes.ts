import { PropertyTypeEnum } from '@src/designEngine'
import propertyCellBase from './propertyCellBase'
export { PropertyTypeEnum, propertyCellBase }

var cellControls: Function[] = []

const modulesFiles = require.context('.', true, /\.(js|ts|vue)$/)
window.console.log('modulesFiles:', modulesFiles)
export function propertyCellTypeAttr(type: PropertyTypeEnum) {
  return function(target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.celltype = type
    // window.console.log('类型访问器:', target)
  }
}

export function getCellControl(propertyType: PropertyTypeEnum): typeof propertyCellBase {
  return cellControls.filter((o) => o.prototype.$Meta.celltype == propertyType)[0] as typeof propertyCellBase
}
