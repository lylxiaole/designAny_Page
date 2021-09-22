<template>
  <div :style="{background:backgroundColor}">
    <Gantt ref="gantt" :task="task" backgroundColor="#ffffff" :chartDateWidth="this.width" :chartDateHeight="this.height"
      :dateHeaderHeight="dateHeaderHeight" :dateHeaderFontSize="dateHeaderFontSize" :dateHeaderFontWeight="dateHeaderFontWeight"
      :dateHeaderColor="dateHeaderColor" :dateBorderColor="dateBorderColor" :dateBackgroundColor="dateBackgroundColor"
      :splitLineColor="splitLineColor" :verticalSplitLineColor="verticalSplitLineColor" :oddTaskBackgroundColor="oddTaskBackgroundColor"
      :evenTaskBackgroundColor="evenTaskBackgroundColor" :projectBackgroundColor="projectBackgroundColor"
      :middleBackgroundColor="middleBackgroundColor" :taskClickColor="taskClickColor" :taskHoverColor="taskHoverColor"
      :isUseDefaultPopup="isUseDefaultPopup" :weekdayBGColor="weekdayBGColor" :showNonWeekday="showNonWeekday" :workBGColor="workBGColor"
      :holidayBGColor="holidayColor" :timeDivDate="timeDivDate" :activeShowValue="activeShowValue" :disable="disable" :rowHeight="rowHeight"
      :colorList="colorList" :dependencyColor="taskDependencyColor" :popForm="popForm" :drapDepen="drapDepen" @dblclickRowWrapper="dblclickRowWrapper"
      @mouseover="mouseover" :rowHeightModel="rowHeightModel" :setFirstTop="setFirstTop" :setRowInHeightT="setRowInHeightT"
      :setRowInHeightS="setRowInHeightS" :setLineTwoTop="setLineTwoTop" @clickRowWrapper="clickRowWrapper"
      @rightClickRowWrapper="rightClickRowWrapper" @leftTableClickRow="leftTableClickRow" @leftTableHoverRow="leftTableHoverRow"
      @leftTableLeaveRow="leftTableLeaveRow" @handleTableScroll="handleTableScroll" :isDepend="isDepend" :ganttMove="ganttMove"
      :workTimeType="workTimeType">
    </Gantt>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { ComponentBase } from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'

import Gantt from './components/gantt.vue'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Color_Property,
  Boolean_Property,
  Number_Property,
  TimePickerFile_Property
} from '../../03designerLayoutBase'

enum propertyGroupEnum {
  dateSetting = '日期头设置',
  specialTimeSetting = '特殊时间显示设置',
  taskColorSetting = '任务相关颜色设置',
  taskHeightSetting = '任务相关高度设置'
}

@Component({
  components: {
    Gantt: Gantt
  }
})
export default class GanttComponent extends ComponentBase {
  inparam: param[]
  outparam: param

  mounted() {
    this.height = 500
    this.width = 900

    this.registerProperty('日期头高度', propertyGroupEnum.dateSetting, new Number_Property(), 32)
    this.registerProperty('日期头字体大小', propertyGroupEnum.dateSetting, new Number_Property(), 17)
    this.registerProperty('日期头字体粗细值', propertyGroupEnum.dateSetting, new Number_Property(), 600)
    this.registerProperty('日期头部字体颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#404040')
    this.registerProperty('日期边框颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#d7d7d7')
    this.registerProperty('日期头背景颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#f1f1f1')

    this.registerProperty('周末高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.registerProperty('周末颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#f1f1f1')
    this.registerProperty('节假日高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.registerProperty('节假日高亮颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#f1f1f1')
    this.registerProperty('节假日', propertyGroupEnum.specialTimeSetting, null, null, false, true) //暂无法获取数据，所以未写默认值,格式为yyyy-mm-dd
    this.registerProperty('设置特殊时间高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.registerProperty('特殊时间', propertyGroupEnum.specialTimeSetting, null, null, false, true) //暂无法获取数据，所以未写默认值,格式为yyyy-mm-dd hh:mm
    this.registerProperty('非上班时间高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.registerProperty('非上班时间颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#f1f1f1')
    this.registerProperty('上班开始时间', propertyGroupEnum.specialTimeSetting, new TimePickerFile_Property('time'), new Date(2019, 1, 1, 6, 0))
    this.registerProperty('上班结束时间', propertyGroupEnum.specialTimeSetting, new TimePickerFile_Property('time'), new Date(2019, 1, 1, 18, 0))

    this.registerProperty('展示实际任务条', propertyGroupEnum.taskColorSetting, new Boolean_Property(), true) //应该作为方法抛出，待修改
    this.registerProperty('实际任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#244089')
    this.registerProperty('project层任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#b5e9ff')
    this.registerProperty('project层任务条完成颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#244089')
    this.registerProperty('middle层任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#00a1eb')
    this.registerProperty('middle层任务条完成颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#00a1eb')
    this.registerProperty('task层任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#34d075')
    this.registerProperty('task层任务条完成颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#80edc4')
    this.registerProperty('任务依赖线颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#00a1eb')
    this.registerProperty('奇数任务行颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.registerProperty('偶数任务行颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.registerProperty('project任务行背景颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.registerProperty('middle任务行背景颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.registerProperty('任务行分割线颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#E3E3E3')
    this.registerProperty('任务行纵向分割线颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#E3E3E3')
    this.registerProperty('任务行鼠标选中颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#f2f2f2')
    this.registerProperty('任务行鼠标悬停颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#f2f2f2')

    this.registerProperty('每行高度', propertyGroupEnum.taskHeightSetting, new Number_Property(40), 40)
    this.registerProperty('自动设置任务条高度', propertyGroupEnum.taskHeightSetting, new Boolean_Property(), true)
    this.registerProperty('预计任务条和顶部的高度', propertyGroupEnum.taskHeightSetting, new Number_Property(), 8)
    this.registerProperty('展示实际任务条时预计任务条的高度', propertyGroupEnum.taskHeightSetting, new Number_Property(), 12)
    this.registerProperty('不展示实际任务条时预计任务条的高度', propertyGroupEnum.taskHeightSetting, new Number_Property(), 24)
    this.registerProperty('实际任务条和顶部的距离', propertyGroupEnum.taskHeightSetting, new Number_Property(), 24)

    // this.registerProperty('气泡卡片内容', PropertyGroupName.special, null, null, false, true) //暂无法获取数据，所以未写默认值
    this.registerProperty('是否使用默认弹窗（鼠标悬停任务条时）', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('甘特图可编辑', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('拖拽联动', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('生产日历数据格式', PropertyGroupName.special, new Enum_Property(true, ['周循环', '详细时间']), '周循环')
    this.registerProperty('气泡卡片内容', PropertyGroupName.normal, null, [])
    this.registerProperty('是否展示依赖线', PropertyGroupName.special, new Boolean_Property(), true)

    this.registerEvents('任务条双击事件', '', this.inparam, this.outparam)
    this.registerEvents('任务条选中事件', '', this.inparam, this.outparam)
    this.registerEvents('任务条右击事件', '', this.inparam, this.outparam)
    this.registerEvents('任务条悬浮事件', '', this.inparam, this.outparam)

    this.registerMethods('新增任务', '', this.addNewTask, this.inparam, null)
    this.registerMethods('删除任务', '', this.deleteTask, this.inparam, null)
    this.registerMethods('修改任务', '', this.changeTask, this.inparam, null)
    this.registerMethods('任务位置互换', '', this.exchangeTask, this.inparam, null)
    this.registerMethods('任务条移动', '', this.moveToTask, this.inparam, null)
    this.registerMethods('获取数据源', '', this.getSaveTask, null, this.outparam)
    this.registerMethods('撤销', '', this.undo, null, null)
    this.registerMethods('重做', '', this.redo, null, null)
    this.registerMethods('获取撤销列表', '', this.getUndoList, null, this.outparam)
    this.registerMethods('获取重做列表', '', this.getRedoList, null, this.outparam)
    this.registerMethods('加载数据方法', '', this.refreshData, this.inparam, null)

    let levelLabel: param[] = []
    levelLabel.push({ name: '日期显示级别（hour/day/week/month/year）', type: paramType.string, val: null })
    this.registerMethods('快速定位日期等级方法', '', this.changeLevel, this.inparam, this.outparam)

    let levelNumber: param[] = []
    levelNumber.push({ name: '日期显示级别1-13（hour1-3/day4-8/week9/month10-11/year12-13）', type: paramType.number, val: null })
    this.registerMethods('滑块快速缩放日期', '', this.zoomDate, this.inparam, this.outparam)

    let dateString: param[] = []
    dateString.push({ name: '日期范围("2019-09-15","2019-09-16")', type: paramType.complexType, val: null })
    this.registerMethods('日期快速定位', '', this.locateDate, this.inparam, this.outparam)
    this.registerMethods('缩放至合适', '', this.zoomToFit, this.inparam, this.outparam)
    this.registerMethods('折叠展开', '', this.handlerExpand, this.inparam, null)
  }

  get isDepend(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否展示依赖线')[0]) {
      if (this.findProperties(PropertyGroupName.special, '是否展示依赖线')[0].value == false)
        return this.findProperties(PropertyGroupName.special, '是否展示依赖线')[0].value
    }
    return true
  }

  get ganttMove(): boolean {
    return false
  }

  //日期头设置
  get dateHeaderHeight(): number {
    if (this.findProperties(propertyGroupEnum.dateSetting, '日期头高度')[0]) {
      if (this.findProperties(propertyGroupEnum.dateSetting, '日期头高度')[0].value)
        return this.findProperties(propertyGroupEnum.dateSetting, '日期头高度')[0].value
    }
  }
  get dateHeaderFontSize(): number {
    if (this.findProperties(propertyGroupEnum.dateSetting, '日期头字体大小')[0]) {
      if (this.findProperties(propertyGroupEnum.dateSetting, '日期头字体大小')[0].value)
        return this.findProperties(propertyGroupEnum.dateSetting, '日期头字体大小')[0].value
    }
  }
  get dateHeaderFontWeight(): number {
    if (this.findProperties(propertyGroupEnum.dateSetting, '日期头字体粗细值')[0]) {
      if (this.findProperties(propertyGroupEnum.dateSetting, '日期头字体粗细值')[0].value)
        return this.findProperties(propertyGroupEnum.dateSetting, '日期头字体粗细值')[0].value
    }
  }
  get dateHeaderColor(): string {
    if (this.findProperties(propertyGroupEnum.dateSetting, '日期头部字体颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.dateSetting, '日期头部字体颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.dateSetting, '日期头部字体颜色')[0].value as string
      }
    }
  }
  get dateBorderColor(): string {
    if (this.findProperties(propertyGroupEnum.dateSetting, '日期边框颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.dateSetting, '日期边框颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.dateSetting, '日期边框颜色')[0].value as string
      }
    }
  }
  get dateBackgroundColor(): string {
    if (this.findProperties(propertyGroupEnum.dateSetting, '日期头背景颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.dateSetting, '日期头背景颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.dateSetting, '日期头背景颜色')[0].value as string
      }
    }
  }

  //特殊时间显示设置
  get showNonWeekday(): boolean {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '周末高亮')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '周末高亮')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '周末高亮')[0].value
      }
    }
  }
  get weekdayBGColor(): string {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '周末颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '周末颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '周末颜色')[0].value as string
      }
    }
  }
  get holidayShow(): boolean {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮')[0].value
      }
    }
  }
  get holidayColor(): string {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮颜色')[0].value as string
      }
    }
  }
  get userSetShow(): boolean {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '设置特殊时间高亮')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '设置特殊时间高亮')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '设置特殊时间高亮')[0].value
      }
    }
  }
  get dayShow(): boolean {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '非上班时间高亮')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '非上班时间高亮')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '非上班时间高亮')[0].value
      }
    }
  }
  get workBGColor(): string {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '非上班时间颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '非上班时间颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '非上班时间颜色')[0].value as string
      }
    }
  }
  get dayStartTime(): string {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '上班开始时间')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '上班开始时间')[0].value) {
        let time = this.findProperties(propertyGroupEnum.specialTimeSetting, '上班开始时间')[0].value
        let timeString = '6:00'
        try {
          timeString = time.getHours() + ':' + time.getMinutes()
        } catch (error) {
          if (error.toString().indexOf('time.getHours is not a function')) {
            let dateList = time.split('T')
            let timeList = dateList[1].split(':')
            timeString = timeList[0] + ':' + timeList[1]
          }
        }
        return timeString
      }
    } else {
      return '6:00'
    }
  }
  get dayEndTime(): string {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '上班结束时间')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '上班结束时间')[0].value) {
        let time = this.findProperties(propertyGroupEnum.specialTimeSetting, '上班结束时间')[0].value
        let timeString = '6:00'
        try {
          timeString = time.getHours() + ':' + time.getMinutes()
        } catch (error) {
          if (error.toString().indexOf('time.getHours is not a function')) {
            let dateList = time.split('T')
            let timeList = dateList[1].split(':')
            timeString = timeList[0] + ':' + timeList[1]
          }
        }
        return timeString
      }
    } else {
      return '6:00'
    }
  }
  get timeDivDate(): any {
    return {
      day: { isShow: this.dayShow, startTime: this.dayStartTime, endTime: this.dayEndTime },
      holiday: { isShow: this.holidayShow, color: this.holidayColor, list: this.holidayList },
      userSet: { isShow: this.userSetShow, list: this.userSetList }
    }
  }
  get holidayList(): string[] {
    let item = ['2019-9-23', '2019-9-30', '2020-5-1']
    return item
  }
  get userSetList(): any[] {
    return [
      { start: '2019-9-16 10:00', end: '2019-9-16 11:00', color: '#eeeeee' },
      { start: '2019-9-10 10:00', end: '2019-9-10 11:00', color: '#eeeeee' }
    ]
  }

  //任务相关颜色设置
  get activeShowValue(): boolean {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '展示实际任务条')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '展示实际任务条')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '展示实际任务条')[0].value
      }
    }
  }
  get taskActuelTimeColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '实际任务条颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '实际任务条颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '实际任务条颜色')[0].value as string
      }
    }
  }
  get projectTypeColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'project层任务条颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'project层任务条颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'project层任务条颜色')[0].value as string
      }
    }
  }
  get projectTypePerColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'project层任务条完成颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'project层任务条完成颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'project层任务条完成颜色')[0].value as string
      }
    }
  }
  get middleTypeColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条颜色')[0].value as string
      }
    }
  }
  get middleTypePerColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条完成颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条完成颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条完成颜色')[0].value as string
      }
    }
  }
  get taskTypeColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'task层任务条颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'task层任务条颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'task层任务条颜色')[0].value as string
      }
    }
  }
  get taskTypePerColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'task层任务条完成颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'task层任务条完成颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'task层任务条完成颜色')[0].value as string
      }
    }
  }
  get taskDependencyColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务依赖线颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务依赖线颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '任务依赖线颜色')[0].value as string
      }
    }
  }
  get splitLineColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行分割线颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行分割线颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '任务行分割线颜色')[0].value as string
      }
    }
  }
  get verticalSplitLineColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行纵向分割线颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行纵向分割线颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '任务行纵向分割线颜色')[0].value as string
      }
    }
  }
  get oddTaskBackgroundColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '奇数任务行颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '奇数任务行颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '奇数任务行颜色')[0].value as string
      }
    }
  }
  get evenTaskBackgroundColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '偶数任务行颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '偶数任务行颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '偶数任务行颜色')[0].value as string
      }
    }
  }
  get projectBackgroundColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'project任务行背景颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'project任务行背景颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'project任务行背景颜色')[0].value as string
      }
    }
  }
  get middleBackgroundColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, 'middle任务行背景颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, 'middle任务行背景颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, 'middle任务行背景颜色')[0].value as string
      }
    }
  }
  get taskClickColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标选中颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标选中颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标选中颜色')[0].value as string
      }
    }
  }
  get taskHoverColor(): string {
    if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标悬停颜色')[0]) {
      if (this.findProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标悬停颜色')[0].value) {
        return this.findProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标悬停颜色')[0].value as string
      }
    }
  }
  get colorList(): any {
    return {
      lineTwoColor: this.taskActuelTimeColor, //实际
      projectColor: this.projectTypeColor, //project类型的任务条颜色
      projectPerColor: this.projectTypePerColor, //project类型的任务条完成百分比颜色
      middleColor: this.middleTypeColor, //middle类型的任务条颜色
      middlePerColor: this.middleTypePerColor, //middle类型的任务条完成百分比颜色
      taskColor: this.taskTypeColor, //task类型的任务条颜色
      taskPerColor: this.taskTypePerColor //task类型的任务条完成百分比颜色
    }
  }

  //任务相关高度设置
  get rowHeight(): number {
    if (this.findProperties(propertyGroupEnum.taskHeightSetting, '每行高度')[0]) {
      if (this.findProperties(propertyGroupEnum.taskHeightSetting, '每行高度')[0].value) {
        return this.findProperties(propertyGroupEnum.taskHeightSetting, '每行高度')[0].value
      }
    }
  }
  get rowHeightModel(): boolean {
    // console.log('rowHeightModel')
    if (this.findProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0]) {
      if (
        this.findProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value == true ||
        this.findProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value == false
      ) {
        // console.log(this.findProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value)
        return this.findProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value
      }
    }
    return true
  }
  get setFirstTop(): number {
    if (this.findProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0]) {
      if (this.findProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0].value) {
        return this.findProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0].value
      } else if (this.findProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0].value == 0) {
        return 0
      }
    }
    return 8
  }
  get setRowInHeightT(): number {
    if (this.findProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0]) {
      if (this.findProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0].value) {
        return this.findProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0].value
      } else if (this.findProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0].value == 0) {
        return 0
      }
    }
    return 12
  }
  get setRowInHeightS(): number {
    if (this.findProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0]) {
      if (this.findProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0].value) {
        return this.findProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0].value
      } else if (this.findProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0].value) {
        return 0
      }
    }
    return 24
  }
  get setLineTwoTop(): number {
    if (this.findProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0]) {
      if (this.findProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0].value) {
        return this.findProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0].value
      } else if (this.findProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0].value == 0) {
        return 0
      }
    }
    return 24
  }

  //特有属性
  get isUseDefaultPopup(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否使用默认弹窗（鼠标悬停任务条时）')[0]) {
      if (this.findProperties(PropertyGroupName.special, '是否使用默认弹窗（鼠标悬停任务条时）')[0].value) {
        if (this.findProperties(PropertyGroupName.special, '是否使用默认弹窗（鼠标悬停任务条时）')[0].value == true) {
          return true
        }
      } else {
        return false
      }
    }
  }
  get disable(): boolean {
    if (this.findProperties(PropertyGroupName.special, '甘特图可编辑')[0]) {
      if (this.findProperties(PropertyGroupName.special, '甘特图可编辑')[0].value) {
        if (this.findProperties(PropertyGroupName.special, '甘特图可编辑')[0].value == true) {
          return this.findProperties(PropertyGroupName.special, '甘特图可编辑')[0].value
        }
      } else {
        return false
      }
    }
  }
  get drapDepen(): boolean {
    if (this.findProperties(PropertyGroupName.special, '拖拽联动')[0]) {
      if (this.findProperties(PropertyGroupName.special, '拖拽联动')[0].value) {
        if (this.findProperties(PropertyGroupName.special, '拖拽联动')[0].value == true) {
          return this.findProperties(PropertyGroupName.special, '拖拽联动')[0].value
        }
      } else {
        return false
      }
    }
  }
  // get popMsgList(): any {
  //   //无法获取数据
  //   return [
  //     { key: 'id', value: '156865978' },
  //     { key: '百分比', value: 20 },
  //   ]
  // }

  get workTimeType(): string {
    if (this.findProperties(propertyGroupEnum.specialTimeSetting, '生产日历数据格式')[0]) {
      if (this.findProperties(propertyGroupEnum.specialTimeSetting, '生产日历数据格式')[0].value)
        return this.findProperties(propertyGroupEnum.specialTimeSetting, '生产日历数据格式')[0].value
    }
    return '周循环'
  }

  get popForm(): any {
    if (this.findProperties(PropertyGroupName.normal, '气泡卡片内容')[0]) {
      if (this.findProperties(PropertyGroupName.normal, '气泡卡片内容')[0].value) {
        return this.findProperties(PropertyGroupName.normal, '气泡卡片内容')[0].value
      }
    }
    return []
  }

  get task(): any[] {
    let item = [
      {
        taskName: '1',
        ower: '',
        type: 'project',
        percentage: 0,
        planBeginTime: '',
        planEndTime: '',
        id: 1568028397666,
        isShow: true,
        children: [
          {
            taskName: '4',
            ower: '',
            type: 'middle',
            percentage: 0,
            planBeginTime: '',
            planEndTime: '',
            id: 1568028467666,
            parentId: 1568028397666,
            isShow: true,
            children: [
              {
                taskName: '1',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 0,
                isShow: true,
                planBeginTime: 1568505600000,
                // planBeginTime: 1514736000000,
                planEndTime: 1568592000000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1568028403474,
                parentId: 1568028467666,
                dependOn: [1568028464174]
              },
              {
                taskName: '4',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 50,
                isShow: true,
                planBeginTime: 1567958400000,
                // planBeginTime: 1514736000000,
                planEndTime: 1568217600000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1568028403488,
                parentId: 1568028467666
              }
            ]
          }
        ]
      },
      {
        taskName: '5',
        ower: '',
        type: 'project',
        percentage: 0,
        planBeginTime: '',
        planEndTime: '',
        isShow: true,
        id: 1568133397666,
        children: [
          {
            taskName: '6',
            ower: '',
            type: 'middle',
            percentage: 0,
            planBeginTime: '',
            planEndTime: '',
            isShow: true,
            id: 1568544467666,
            parentId: 1568133397666,
            children: [
              {
                taskName: '7',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 0,
                isShow: true,
                planBeginTime: 1568937600000,
                planEndTime: 1569024000000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1568028464174,
                parentId: 1568544467666
              },
              {
                taskName: '8',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 50,
                isShow: true,
                planBeginTime: 1567958400000,
                planEndTime: 1568217600000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1567028403488,
                parentId: 1568544467666,
                dependOn: [1568028403488]
              }
            ]
          }
        ]
      },
      {
        taskName: '5',
        ower: '',
        type: 'project',
        percentage: 0,
        planBeginTime: '',
        planEndTime: '',
        isShow: true,
        id: 1568648397666,
        children: [
          {
            taskName: '6',
            ower: '',
            type: 'middle',
            percentage: 0,
            planBeginTime: '',
            planEndTime: '',
            isShow: true,
            id: 1564129467666,
            parentId: 1568648397666,
            children: [
              {
                taskName: '7',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 0,
                isShow: true,
                planBeginTime: 1569196800000,
                planEndTime: 1569283200000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1568028466194,
                parentId: 1564129467666
                // dependOn: [1568028464174],
              },
              {
                taskName: '8',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 50,
                isShow: true,
                planBeginTime: 1567958400000,
                planEndTime: 1568217600000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1516928403488,
                parentId: 1564129467666,
                dependOn: [1567028403488]
              }
            ]
          }
        ]
      },
      {
        taskName: '5',
        ower: '',
        type: 'project',
        percentage: 0,
        planBeginTime: '',
        planEndTime: '',
        isShow: true,
        id: 4638648397666,
        children: [
          {
            taskName: '6',
            ower: '',
            type: 'middle',
            percentage: 0,
            planBeginTime: '',
            planEndTime: '',
            isShow: true,
            id: 1564463266666,
            parentId: 4638648397666,
            children: [
              {
                taskName: '7',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 0,
                isShow: true,
                planBeginTime: 1569888000000,
                planEndTime: 1570060800000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1564685366194,
                parentId: 1564463266666,
                dependOn: [1568028466194]
              },
              {
                taskName: '8',
                ower: '',
                type: 'task',
                stoneTime: '',
                percentage: 50,
                isShow: true,
                planBeginTime: 1567958400000,
                planEndTime: 1568217600000,
                actualBeginTime: 1567958400000,
                actualEndTime: 1568217600000,
                id: 1166928403488,
                parentId: 1564463266666,
                dependOn: [1516928403488]
              }
            ]
          }
        ]
      }
    ]
    if (this.findProperties(PropertyGroupName.special, '数据源')) {
      if (this.findProperties(PropertyGroupName.special, '数据源')[0]) {
        this.findProperties(PropertyGroupName.special, '数据源')[0].value = item
      }
    }
    return item
  }
  refreshData(date: any[]) {
    if (this.findProperties(PropertyGroupName.special, '数据源')) {
      if (this.findProperties(PropertyGroupName.special, '数据源')[0]) {
        this.findProperties(PropertyGroupName.special, '数据源')[0].value = date
      }
    }
    return date
  }

  //基本设置
  get backgroundColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '背景色')[0]) {
      if (this.findProperties(PropertyGroupName.normal, '背景色')[0].value) {
        return this.findProperties(PropertyGroupName.normal, '背景色')[0].value as string
      }
    }
  }

  //事件
  dblclickRowWrapper(item: any) {
    this.triggeEvent('任务条双击事件', item)
  }
  clickRowWrapper(item: any) {
    this.triggeEvent('任务条选中事件', item)
  }
  rightClickRowWrapper(item: any) {
    this.triggeEvent('任务条右击事件', item)
  }
  mouseover(item: any) {
    this.triggeEvent('任务条悬浮事件', item)
  }

  //方法
  addNewTask(item: any, depen: any[], type?: string): void {
    let gantt = this.$refs.gantt as any
    if (type) {
      gantt.addNewTask(item, depen, type)
    } else {
      gantt.addNewTask(item, depen, 'un')
    }
  }

  deleteTask(id: any, type?: string): void {
    let gantt = this.$refs.gantt as any
    if (type) {
      gantt.deleteTask(id, type)
    } else {
      gantt.deleteTask(id, 'un')
    }
  }

  changeTask(item: any, type?: string): void {
    let gantt = this.$refs.gantt as any
    if (type) {
      gantt.changeTask(item, type)
    } else {
      gantt.changeTask(item, 'un')
    }
  }

  exchangeTask(idf: any, ids: any, type?: string): void {
    let gantt = this.$refs.gantt as any
    if (type) {
      gantt.exchangeTask(idf, ids, type)
    } else {
      gantt.exchangeTask(idf, ids, 'un')
    }
  }

  moveToTask(id: any, newParentId: any, index?: number, type?: string): void {
    let gantt = this.$refs.gantt as any
    if (type) {
      gantt.moveToTask(id, newParentId, index, type)
    } else {
      gantt.moveToTask(id, newParentId, index, 'un')
    }
  }

  changeLevel(label: string): void {
    let gantt = this.$refs.gantt as any
    if (label[0] == 'hour') {
      gantt.handleSetDaySize('hour', 50, 2, 50, 10 * 60 * 1000, false)
    } else if (label[0] == 'day') {
      gantt.handleSetDaySize('day', 70, 4, 70, 60 * 60 * 1000, false)
    } else if (label[0] == 'week') {
      gantt.handleSetDaySize('week', 20, 9, 20, 24 * 60 * 60 * 1000, false)
    } else if (label[0] == 'month') {
      gantt.handleSetDaySize('month', 40, 10, 40, 24 * 60 * 60 * 1000, false)
    } else if (label[0] == 'year') {
      gantt.handleSetDaySize('year', 50, 12, 50, (365 / 12) * 24 * 60 * 60 * 1000, false)
    }
  }
  zoomDate(level: number): void {
    let gantt = this.$refs.gantt as any
    gantt.changeDaySize(level[0])
  }
  locateDate(dateString: any): void {
    let gantt = this.$refs.gantt as any
    gantt.handlerDateRangOnChange(dateString[0])
  }
  zoomToFit(): void {
    let gantt = this.$refs.gantt as any
    gantt.zoomToFit()
  }

  getSaveTask(): any[] {
    let gantt = this.$refs.gantt as any
    let saveTask = gantt.getResultTask()
    return saveTask
  }

  undo(): void {
    let gantt = this.$refs.gantt as any
    gantt.undo()
  }

  redo(): void {
    let gantt = this.$refs.gantt as any
    gantt.redo()
  }

  getUndoList(): any[] {
    let gantt = this.$refs.gantt as any
    return gantt.undoList
  }

  getRedoList(): any[] {
    let gantt = this.$refs.gantt as any
    return gantt.redoList
  }

  handlerExpand(id: any, isexpand: boolean): void {
    let gantt = this.$refs.gantt as any
    gantt.handlerExpand(id, isexpand)
  }

  leftTableClickRow(task: any) {
    //console.log("表格行点击了---")
  }
  leftTableHoverRow(task: any) {
    //console.log("表格行悬停了---")
  }
  leftTableLeaveRow(task: any) {
    //console.log("表格行离开了---")
  }
  handleTableScroll(scrollTop: any) {
    //console.log("滑块滑动了---")
  }
}
</script>