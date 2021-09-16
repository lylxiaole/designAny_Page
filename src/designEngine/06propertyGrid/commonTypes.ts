import { PropertyTypeEnum } from '../02common/commonClasses/LayoutProperty'
import propertyCellBase from './propertyCellBase'

import pageInParams from './pageInParams/pageInParams.vue'
import calendarEvents from './calendarEvents/calendarEvents.vue'
import bindingModels from './bindingModels/bindingModels.vue'
import authorityControl from './authorityControl/authorityControl.vue'
import behaviorControl from './behaviorControl/behaviorControl.vue'
import colorControl from './colorControl/colorControl.vue'
import enumControl from './enumControl/enumControl.vue'
import jsCodeControl from './jsCodeControl/jsCodeControl.vue'
import numberControl from './numberControl/numberControl.vue'
import numberList from './numberControl/numberList.vue'
import pageTemplateSetting from './pageTemplateSetting/pageTemplateSetting.vue'
import textControl from './textControl/textControl.vue'
import textList from './textControl/textList.vue'
import booleanControl from './booleanControl/booleanControl.vue'
import timePickerControl from './timePickerControl/timePickerControl.vue'
import upLoadFileControl from './upLoadFileControl/upLoadFileControl.vue'
import buttonAttribute from './buttonAttribute/buttonAttribute.vue'
import tableStyleSetting from './tableStyleSetting/tableStyleSetting.vue'
import breadcrumAttribute from './breadcrumAttribute/breadcrumAttribute.vue'
import selectElement from './selectElement/selectElement.vue'
import selectGroupElement from './selectElement/selectGroupElement.vue'
import selectDictModel from './selectDictModel/selectDictModel.vue'
import dropDownControl from './dropDownControl/dropDownControl.vue'
import enumModal from './enumControl/enumModal.vue'
import fileTemplateModal from './globalControl/fileTemplateModal.vue'
import tableExportSetting from './tableExportSetting/tableExportSetting.vue'

var cellControls: Function[] = [
  pageInParams,
  calendarEvents,
  bindingModels,
  authorityControl,
  behaviorControl,
  colorControl,
  enumControl,
  jsCodeControl,
  numberControl,
  numberList,
  textControl,
  textList,
  booleanControl,
  timePickerControl,
  upLoadFileControl,
  buttonAttribute,
  tableStyleSetting,
  breadcrumAttribute,
  selectElement,
  selectGroupElement,
  selectDictModel,
  dropDownControl,
  enumModal,
  fileTemplateModal,
  pageTemplateSetting,
  tableExportSetting
]

export { PropertyTypeEnum, propertyCellBase }

export function propertyCellTypeAttr(type: PropertyTypeEnum) {
  return function(target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.celltype = type
    // window.console.log('类型访问器:', target)
  }
}

// export function propertyValueAttr() {
//   return function(target: any, propertyName: string) {
//     !target.prototype.$Meta && (target.prototype.$Meta = {})
//     target.prototype.$Meta.propertyValueCode = propertyName
//     // window.console.log('属性访问器:', target, propertyName)
//   }
// }

export function getCellControl(propertyType: PropertyTypeEnum): typeof propertyCellBase {
  return cellControls.filter((o) => o.prototype.$Meta.celltype == propertyType)[0] as typeof propertyCellBase
}
