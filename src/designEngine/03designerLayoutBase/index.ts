/**********此处import时需要保证类的继承顺序***************** */
import BaseEvents, { DragItemData, DragItemTypeEnum } from './BaseEvents'
import LayoutBase, { LayoutType, LayoutInfo, SaveInfo } from './LayoutBase'
import LayoutContainer from './LayoutContainer'
import ComponentBase from './ComponentBase'
import PageBase from './PageBase'

export { BaseEvents, LayoutBase, LayoutContainer, ComponentBase, PageBase }
export { DragItemData, DragItemTypeEnum, LayoutType, LayoutInfo, SaveInfo }
export { Property, PropertyType, PropertyTypeEnum } from './commonClasses/LayoutProperty'

export {
  PropertyGroupName,
  Boolean_Property,
  Text_Property,
  Number_Property,
  NumberList_Property,
  TextList_Property,
  Enum_Property,
  Color_Property,
  UploadFile_Property,
  JavaScriptCode_Property,
  TimePickerFile_Property,
  Behavior_Property,
  Authority_Property,
  BindingModels_Property,
  PageInParams_Property,
  Button_Property,
  EnumModal_Property,
  FileTemplateModal_Property,
  TableStyleSetting_Property,
  TableExportSetting_Property,
  PageTemplateSetting_Property,
  calendarEvents_Property,
  Breadcrum_Property,
  Select_Property,
  SelectGroup_Property,
  selectDict_Property,
  dropDown_Property
} from './commonClasses/LayoutProperty'

export { param, paramType, layoutEvent, layoutMethod } from './commonClasses/layoutEvent'
export { paramInfo } from './commonClasses/pageInParamInfo'
export { factory } from './behavior'
export { CompIndex } from './commonClasses/memoryCache'

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
