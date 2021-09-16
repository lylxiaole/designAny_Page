import ComponentBase from './ComponentBase'
import { SaveInfo } from '../03designerLayoutBase/LayoutBase'

import TextComponent from './textComponents/TextComponent.vue'
import upLoadComponent from './upLoadComponents/upLoadComponent.vue'

import NpBarCode from './barCode/NpBarCode.vue'
import NPQrCode from './barCode/NPQrCode.vue'

import TransferComponent from './transferComponents/TransferComponnt.vue'
import TransferTableComponent from './transferComponents/TransferTableComponent.vue'
import TransferComponentNew from './transferComponents/TransferComponentsNew.vue'

import TreeSelectComponent from './treeSelectComponents/TreeSelectComponent.vue'
import TreeComponent from './treeSelectComponents/TreeComponent.vue'

import RadioComponent from './radioComponents/RadioComponent.vue'
import CheckboxComponent from './checkboxComponents/CheckboxComponent.vue'
import CardComponent from './cardComponents/CardComponent.vue'
import ConfigurableCardComponent from './cardComponents/ConfigurableCardComponent.vue'
import QuadrangleComponent from './quadrangleComponents/QuadrangleComponent.vue'
import MediaComponent from './mediaComponents/MediaComponent.vue'
import ButtonComponent from './buttonComponents/ButtonComponent.vue'
import AntCalendarComponent from './calendar/AntCalendar.vue'
//import TabsComponent from './tabsComponents/TabsComponent.vue'
import Tabs from './tabs/Tabs.vue'
import BreadcrumComponent from './breadcrumComponents/BreadcrumComponent.vue'
import RateComponent from './rateComponents/RateComponent.vue'
import SwitchComponent from './switchComponents/switchComponent.vue'
import SelectSingleComponent from './selectComponents/selectSingleComponent.vue'
import SelectGroupComponent from './selectComponents/selectGroupComponent.vue'
import SelectVariedComponent from './selectComponents/selectVariedComponent.vue'
import CountDownComponent from './countDownComponents/CountDownComponent.vue'
import CountTimerComponent from './countTimerComponents/CountTimerComponent.vue'
import LineComponent from './progressComponents/LineComponent.vue'
import CircleComponent from './progressComponents/CircleComponent.vue'
import DashboardComponent from './progressComponents/DashboardComponent.vue'
import LayoutCol from './grid/LayoutCol.vue'
import LayoutRow from './grid/LayoutRow.vue'
import NpGridCol from './grid/NpGridCol.vue'
import LayoutCol_Ext from './grid/LayoutCol_Ext.vue'

import NpGridCell from './grid/NpGridCell.vue'
import NpRepeatGrid from './grid/NpRepeatGrid.vue'
import dropDown from './dropDownComponents/dropDown.vue'

import NpForm from './form/NpForm.vue'
import NpFormItem from './form/NpFormItem.vue'

import Table from './table/Table.vue'
import DatePickerCom from './datePicker/DatePickerCom.vue'
import MonthPickerCom from './datePicker/MonthPickerCom.vue'
import WeekPickerCom from './datePicker/WeekPickerCom.vue'
import TimePickerCom from './datePicker/TimePickerCom.vue'
import DateRangePickerCom from './datePicker/DateRangePickerCom.vue'
import MonthRangePickerCom from './datePicker/MonthRangePickerCom.vue'
import WeekRangePickerCom from './datePicker/WeekRangePickerCom.vue'
import TimeRangePickerCom from './datePicker/TimeRangePickerCom.vue'

import SelectCompositeComponent from './selectCompositeComponents/SelectCompositeComponent.vue'
import CarouselComponent from './carouselComponents/CarouselComponent.vue'
import InputNumberComponent from './InputComponents/InputNumberComponent.vue'
import InputComponent from './InputComponents/InputComponent.vue'
import TextAreaComponent from './InputComponents/TextAreaComponent.vue'
import InputRichComponent from './InputComponents/InputRichComponent.vue'
import GanttCom from './ganttCom/GanttCom.vue'
import componentTemplate from './componentTemplate/componentTemplate.vue'
import printAreaComponent from './componentTemplate/printAreaComponent.vue'
// import tabContent from './tabsComponents/TabContent.vue'
//import flowCompomemt from './flowComponents/flow.vue'
import flowCompomemt from './flowComponents/flowX6.vue'
import mindCompomemt from './mindComponents/mind.vue'
import inputCompositeTemplate from './compositeTemplate/InputCompositeTemplate.vue'
import SelectMultipleComponent from './selectComponents/selectMultipleComponent.vue'
import { LayoutInfo, LayoutType } from '../03designerLayoutBase/LayoutBase'

import reportComponentNew from './reportComponents/ReportComponentnew.vue'
import personal_SearchControl from './personal_SearchControl/personal_SearchControl.vue'
import personalLayout from './personal_layout/personalLayout.vue'
import personalDragLayout from './personal_layout/personalDragLayout.vue'

import npReportComponent from './npReportComponents/ReportComponent.vue'

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
} from '../assets/icons.js'

class CompIndex {
  static indexs = {}
}

export var AllComponents: LayoutInfo[] = [
  //功能组件
  new LayoutInfo(LayoutType.system_component, '功能组件', '按钮', ButtonComponent, buttonIco, null, null, 'ButtonComponent'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '文本组件', TextComponent, textIco, null, null, 'TextComponent'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '四边形', QuadrangleComponent, quadrangleIco, null, null, 'QuadrangleComponent'),
  new LayoutInfo(LayoutType.system_component, '功能组件', 'Tabs标签页', Tabs, tabsIco, null, null, 'Tabs'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '面包屑', BreadcrumComponent, breadcrumbIco, null, null, 'BreadcrumComponent'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '评分组件', RateComponent, rateIco, null, null, 'RateComponent'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '文件上传', upLoadComponent, uploadIco, null, null, 'upLoadComponent'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '下拉菜单', dropDown, dropDownIco, null, null, 'dropDown'),
  new LayoutInfo(LayoutType.system_component, '功能组件', '查询组件', personal_SearchControl, dropDownIco, null, null, 'personal_searchComponent'),
  // new LayoutInfo(LayoutType.system_component, '功能组件', '个性化布局', personalLayout, dropDownIco, null, null, 'personalLayout'),

  //输入框
  new LayoutInfo(LayoutType.system_component, '输入框', '数字输入框', InputNumberComponent, inputNumberIco, null, null, 'InputNumberComponent'),
  new LayoutInfo(LayoutType.system_component, '输入框', '文本输入框', InputComponent, inputIco, null, null, 'InputComponent'),
  new LayoutInfo(LayoutType.system_component, '输入框', '多行文本框', TextAreaComponent, textArea, null, null, 'TextAreaComponent'),
  new LayoutInfo(LayoutType.system_component, '输入框', '富文本输入框', InputRichComponent, inputRichIco, null, null, 'InputRichComponent'),
  new LayoutInfo(
    LayoutType.system_component,
    '输入框',
    '复合输入框组件',
    inputCompositeTemplate,
    inputCompositeTemplateIco,
    null,
    null,
    'inputCompositeTemplate'
  ),
  //选择项
  new LayoutInfo(LayoutType.system_component, '选择项', '单选按钮', RadioComponent, radioIco, null, null, 'RadioComponent'),
  new LayoutInfo(LayoutType.system_component, '选择项', '复选框', CheckboxComponent, checkboxIco, null, null, 'CheckboxComponent'),
  new LayoutInfo(LayoutType.system_component, '选择项', '树形选择框', TreeSelectComponent, selectIco, null, null, 'TreeSelectComponent'),
  new LayoutInfo(LayoutType.system_component, '选择项', 'switch开关', SwitchComponent, switchIco, null, null, 'SwitchComponent'),
  new LayoutInfo(LayoutType.system_component, '选择项', 'select选择器', SelectSingleComponent, selectIco, null, null, 'SelectSingleComponent'),
  new LayoutInfo(
    LayoutType.system_component,
    '选择项',
    '多选下拉框',
    SelectMultipleComponent,
    selectMultipleIco,
    null,
    null,
    'SelectMultipleComponent'
  ),

  //数据列表
  new LayoutInfo(LayoutType.system_component, '数据列表', '表格', Table, tableIco, null, null, 'Table'),
  new LayoutInfo(LayoutType.system_component, '数据列表', '树', TreeComponent, treeIco, null, null, 'TreeComponent'),
  new LayoutInfo(LayoutType.system_component, '数据列表', '穿梭框', TransferComponent, transferIco, null, null, 'TransferComponent'),
  new LayoutInfo(LayoutType.system_component, '数据列表', '穿梭表格', TransferTableComponent, transferTableIco, null, null, 'TransferTableComponent'),
  new LayoutInfo(LayoutType.system_component, '数据列表', '穿梭', TransferComponentNew, transferNewIco, null, null, 'TransferComponentNew'),
  new LayoutInfo(
    LayoutType.system_component,
    '数据列表',
    '复合组件',
    SelectCompositeComponent,
    selectCompositeIco,
    null,
    null,
    'ButSelectCompositeComponenttonComponent'
  ),
  //内容展示
  new LayoutInfo(LayoutType.system_component, '内容展示', '栅格布局-纵向', LayoutCol, npGridIco, null, null, 'LayoutCol'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '栅格布局-横向', LayoutRow, npGridIco, null, null, 'LayoutRow'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '个性化布局', personalDragLayout, dropDownIco, null, null, 'personalDragLayout'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '数据栅格', NpRepeatGrid, npGridIco, null, null, 'NpRepeatGrid'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '表单', NpForm, npFormIco, null, null, 'NpForm'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '条形码', NpBarCode, npGridIco, null, null, 'NpBarCode'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '二维码', NPQrCode, cardIco, null, null, 'NPQrCode'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '卡片', CardComponent, cardIco, null, null, 'CardComponent'),
  new LayoutInfo(
    LayoutType.system_component,
    '内容展示',
    '可配置卡片',
    ConfigurableCardComponent,
    configurableCardIco,
    null,
    null,
    'ConfigurableCardComponent'
  ),
  new LayoutInfo(LayoutType.system_component, '内容展示', '多媒体组件', MediaComponent, mediaIco, null, null, 'MediaComponent'),
  new LayoutInfo(LayoutType.system_component, '内容展示', '走马灯', CarouselComponent, carouselIco, null, null, 'CarouselComponent'),
  //时间组件
  new LayoutInfo(LayoutType.system_component, '时间组件', '日历', AntCalendarComponent, antCalendar, null, null, 'AntCalendarComponent'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '倒计时', CountDownComponent, countDown, null, null, 'CountDownComponent'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '正计时', CountTimerComponent, countTimer, null, null, 'CountTimerComponent'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '进度条', LineComponent, line, null, null, 'LineComponent'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '日期', DatePickerCom, datePickerComIco, null, null, 'DatePickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '月份', MonthPickerCom, monthPickerComIco, null, null, 'MonthPickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '星期', WeekPickerCom, weekPickerComIco, null, null, 'WeekPickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '时间', TimePickerCom, timePickerComIco, null, null, 'TimePickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '日期范围', DateRangePickerCom, dateRangePickerComIco, null, null, 'DateRangePickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '月份范围', MonthRangePickerCom, monthRangePickerComIco, null, null, 'MonthRangePickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '星期范围', WeekRangePickerCom, weekRangePickerComIco, null, null, 'WeekRangePickerCom'),
  new LayoutInfo(LayoutType.system_component, '时间组件', '时间范围', TimeRangePickerCom, timeRangePickerComIco, null, null, 'TimeRangePickerCom'),
  //图形组件
  new LayoutInfo(LayoutType.system_component, '图形组件', '圆形进度条', CircleComponent, circleIco, null, null, 'CircleComponent'),
  new LayoutInfo(LayoutType.system_component, '图形组件', '仪表进度条', DashboardComponent, dashboardIco, null, null, 'DashboardComponent'),
  new LayoutInfo(LayoutType.system_component, '图形组件', '甘特图', GanttCom, ganttIco, null, null, 'GanttCom'),
  //流程图组件
  new LayoutInfo(LayoutType.system_component, '流程组件', '流程图', flowCompomemt, circleIco, null, null, 'flowCompomemt'),
  //脑图
  new LayoutInfo(LayoutType.system_component, '流程组件', '脑图', mindCompomemt, circleIco, null, null, 'mindCompomemt'),
  ///////////////////////////
  new LayoutInfo(LayoutType.functional_component, '内部组件', 'LayoutCol_Ext', LayoutCol_Ext, 'icon-gantetu', null, null, 'LayoutCol_Ext'),

  new LayoutInfo(LayoutType.functional_component, '内部组件', 'NpGridCol', NpGridCol, 'icon-gantetu', null, null, 'NpGridCol'),
  new LayoutInfo(LayoutType.functional_component, '内部组件', 'NpGridCell', NpGridCell, 'icon-gantetu', null, null, 'NpGridCell'),
  new LayoutInfo(LayoutType.functional_component, '内部组件', 'NpFormItem', NpFormItem, 'icon-gantetu', null, null, 'NpFormItem'),
  //
  new LayoutInfo(LayoutType.component_template, '组件模板', '组件模板', componentTemplate, 'icon-gantetu', null, null, 'componentTemplate'),

  // new LayoutInfo(LayoutType.functional_component, '内部组件', 'tabContent', tabContent, 'icon-gantetu', null, null, 'tabContent'),
  new LayoutInfo(LayoutType.system_component, '报表组件', 'reportComponent', reportComponentNew, reportFormIco, null, null, 'reportComponent'),
  new LayoutInfo(LayoutType.system_component, '报表组件', '新版报表组件', npReportComponent, reportFormIco, null, null, 'npReportComponent')
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
export { ComponentBase, SaveInfo, NpForm }

export function findSystemComp(groupName: string, name: string, compType?: LayoutType): any {
  // window.console.log('findSystemComp', CompIndex.indexs)
  if (!CompIndex.indexs[groupName] || !CompIndex.indexs[groupName][name]) {
    return null
  }
  var find = CompIndex.indexs[groupName][name]
  var compInfo: LayoutInfo = null

  if (!compType) {
    compInfo = find
  }
  if (find.type === compType) {
    compInfo = find
  }

  if (compInfo) {
    compInfo.component.compCode = compInfo.compCode
    return compInfo.component
  } else {
    return null
  }
}

export function findSystemCompByCode(code: string): any {
  var comp: LayoutInfo = CompIndex.indexs[code].component
  comp.compCode = code
  return comp
}
