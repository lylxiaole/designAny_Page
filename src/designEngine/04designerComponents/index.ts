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

//////////////////////////////////////////

export class CompIndex {
  static indexs = {}
}

/** */
export function findSystemCompByCode(code: string): any {
  var comp: any = CompIndex.indexs[code].component
  comp.compCode = code
  return comp
}

/**动态读取propertyGrid Cell组件 */
const modulesFiles = require.context('./', true, /\.(js|ts|vue)$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  if (value.default.$Meta.compCode) {
    CompIndex.indexs['compCode'] = value.default.$Meta.compCode
  }
  return modules
}, {})
