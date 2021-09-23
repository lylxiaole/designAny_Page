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
import { CompIndex } from '../03designerLayoutBase'
//////////////////////////////////////////

/**动态读取propertyGrid Cell组件 */
const modulesFiles = require.context('./', true, /\.(vue)$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  if (value.default.$Meta && value.default.$Meta.compCode) {
    CompIndex.indexs['compCode'] = value.default.$Meta.compCode
  }
  return modules
}, {})
