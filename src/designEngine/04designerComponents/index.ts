import { LayoutType, LayoutInfo, ComponentBase } from '../03designerLayoutBase'
import TextComponent from './textComponents/TextComponent.vue'
import NpBarCode from './barCode/NpBarCode.vue'
import NPQrCode from './barCode/NPQrCode.vue'

import { CompIndex } from '../02common/componentHelper/componentsCache'

import {
  buttonIco,
  tabsIco,
  rateIco,
  breadcrumbIco,
  quadrangleIco,
  textIco,
  uploadIco,
  dropDownIco,
  inputIco,
  inputNumberIco,
  inputCompositeTemplateIco,
  inputRichIco,
  textArea,
  selectIco,
  radioIco,
  switchIco,
  checkboxIco,
  selectMultipleIco,
  antCalendar,
  countDown,
  countTimer,
  line,
  datePickerComIco,
  dateRangePickerComIco,
  monthPickerComIco,
  monthRangePickerComIco,
  timePickerComIco,
  timeRangePickerComIco,
  weekPickerComIco,
  weekRangePickerComIco,
  selectCompositeIco,
  tableIco,
  transferIco,
  transferNewIco,
  transferTableIco,
  treeIco,
  circleIco,
  dashboardIco,
  ganttIco,
  cardIco,
  carouselIco,
  configurableCardIco,
  mediaIco,
  npFormIco,
  npGridIco,
  reportFormIco
} from '@src/designEngine/assets/icons.js'

export var AllComponents: LayoutInfo[] = [
  //功能组件
  new LayoutInfo(LayoutType.system_component, '功能组件', '文本组件', TextComponent, textIco, 'TextComponent'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '条形码', NpBarCode, npGridIco, null, 'NpBarCode'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '二维码', NPQrCode, cardIco, null, 'NPQrCode')
]

//////////////计算组件的索引字典/////////////////////////
export function cuteCompIndex() {
  for (let index = 0; index < AllComponents.length; index++) {
    const element = AllComponents[index]
    CompIndex.indexs[element.compCode] = element
    if (CompIndex.indexs[element.groupName]) {
      CompIndex.indexs[element.groupName][element.name] = element
    } else {
      CompIndex.indexs[element.groupName] = {}
      CompIndex.indexs[element.groupName][element.name] = element
    }
  }
}
cuteCompIndex()
//////////////////////////////////////////
