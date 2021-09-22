<template>
  <div>

    <a-calendar :mode="showMode" @select="handleSelect" @panelChange="handlePanelChange" @change="handleChange">
      <div slot="dateCellRender" slot-scope="value" style="text-align: right;height:95%">
        <span v-if="showLunar" class="lunar">{{getLunar(value)}}</span>
        <span v-else style="height:20%"></span>
        <ul v-if="value.get('month') == currentMonthView " class="events" :style="{'height': showLunar? '50%' : '70%' }">

          <!-- <li v-for="item in getListData(value, calenderEvents)" :key="item.id" :style="{background:item.color}" class="li-title"> -->
          <li v-for="item in calenderEventsDayByDay[value.get('date')]" :key="item.id" :style="{background:item.color}" class="li-title"
            @click="clickEvents(item)">

            <a-popover placement="bottomLeft" v-model="item.popVisible" :trigger="item.popTrigger" @mouseenter="onMouseEnterPop(item)">
              <template slot="title">
                <span v-show="(!item.isEdit )|| (!eventTitleEditable)">{{item.eventTitle}}</span>
                <a-input v-show="item.isEdit && eventTitleEditable" size="small" v-model="item.eventTitle" style="height:18px" ref="titleInput" />
              </template>
              <template slot="content">
                <p v-if="item.startTime">开始时间：{{formatTime(item.startTime, 'HH:mm')}}</p>
                <p v-if="item.endTime">结束时间：{{formatTime(item.endTime, 'HH:mm')}}</p>
                <p v-if="item.status">工作状态：{{item.status}}</p>
                <div>
                  <!-- <a-icon type="edit" @click.stop="editEvents(item.id)" /> -->
                  <a-button v-if="editable && !item.isEdit" type="link" @click.stop="editEvents(item)">编辑</a-button>
                  <!-- <a-icon type="delete" @click.stop="deleteEvents(item.id)" /> -->
                  <a-popconfirm v-if="deleteable && !item.isEdit" title="确认删除吗？" @confirm="deleteEvents(item)" okText="确认" cancelText="取消">
                    <a-button type="link">删除</a-button>
                  </a-popconfirm>
                  <a-button v-if="saveable && item.isEdit" type="link" @click.stop="cancelEvent(item)">取消</a-button>
                  <a-button v-if="saveable && item.isEdit" type="link" @click.stop="saveEvents(item)">保存</a-button>

                </div>
              </template>
              <div :style="{width:'100%',color:eventFontColor}">
                <span v-show="(!item.isEdit) || (!eventTitleEditable)">{{item.eventTitle}}</span>
                <a-input v-show="item.isEdit && eventTitleEditable" size="small" v-model="item.eventTitle" readOnly
                  style="height:18px;font-size:12px" />
              </div>
            </a-popover>
          </li>

        </ul>
      </div>
      <template slot="monthCellRender" slot-scope="value">
        <div :style="{border: '0px 1px solid #d9d9d9', borderRadius: '4px', padding: '1px 10px'}">
          <a-calendar :fullscreen="false" :defaultValue="value" />
        </div>
      </template>
    </a-calendar>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

import { ComponentBase } from '../../03designerLayoutBase'
import modelBingding, {
  bindingModelVal_InProperty,
  modelBingValue,
  bindTypeEnum,
  modelDataTypeEnum
} from '../../02common/commonClasses/modelBingding'
import { param, paramType } from '../../03designerLayoutBase'
import moment, { Moment } from 'moment'
import {
  Property,
  Enum_Property,
  PropertyGroupName,
  Color_Property,
  calendarEvents_Property,
  PropertyType,
  Boolean_Property
} from '../../03designerLayoutBase'
import solarLunar from 'solarlunar'
import CalendarEventsInfo from '../../02common/commonClasses/CalendarEventsInfo'
import { CurrentApis } from '../../01designerContext'
import { getUuid, deepClone } from '@src/utils'

@Component
export default class AntCalendar extends ComponentBase {
  inparam: param[]
  outparam: param

  //数据源
  private eventInit(): CalendarEventsInfo[] {
    const value: CalendarEventsInfo[] = [
      {
        id: 1,
        key: '',
        startDate: Vue.prototype.$moment().valueOf(),
        startTime: Vue.prototype.$moment('00:00', 'SS:HH').valueOf(),
        endTime: Vue.prototype.$moment('00:00', 'SS:HH').valueOf(),
        endDate: Vue.prototype.$moment().valueOf(),
        eventTitle: '示例-上班',
        color: this.workEventColor,
        isEdit: false,
        popTrigger: 'hover',
        popVisible: false,
        status: '上班'
      },
      {
        id: 2,
        key: '',
        startDate: Vue.prototype.$moment().valueOf(),
        startTime: Vue.prototype.$moment('00:00', 'SS:HH').valueOf(),
        endTime: Vue.prototype.$moment('00:00', 'SS:HH').valueOf(),
        endDate: Vue.prototype.$moment().valueOf(),
        eventTitle: '示例-放假',
        color: this.restEventColor,
        isEdit: false,
        popTrigger: 'hover',
        popVisible: false,
        status: '休息'
      }
    ]
    return value
  }

  get eventFontColor(): String {
    if (this.findProperties(PropertyGroupName.special, '日程前景色')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '日程前景色')[0].value as String
      return val
    }
    return 'black'
  }

  get showLunar(): boolean {
    if (this.findProperties(PropertyGroupName.special, '显示农历')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '显示农历')[0].value as boolean
      return val
    }
    return true
  }
  get editable(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否显示编辑按钮')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '是否显示编辑按钮')[0].value as boolean
      return val
    }
    return true
  }
  get saveable(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否显示保存按钮')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '是否显示保存按钮')[0].value as boolean
      return val
    }
    return true
  }

  get deleteable(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否显示删除按钮')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '是否显示删除按钮')[0].value as boolean
      return val
    }
    return true
  }

  get eventTitleEditable(): boolean {
    if (this.findProperties(PropertyGroupName.special, '日程名称是否可编辑')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '日程名称是否可编辑')[0].value as boolean

      window.console.log('------------------------------------日程名称是否可编辑------', val)
      return val
    }
    return true
  }
  // get isModifyEventTitle(): boolean {
  //   if (this.findProperties(PropertyGroupName.special, '是否允许双击修改名称')[0]) {
  //     const val = this.findProperties(PropertyGroupName.special, '是否允许双击修改名称')[0].value as boolean
  //     return val
  //   }
  //   return true
  // }
  get workEventColor(): String {
    if (this.findProperties(PropertyGroupName.special, '工作日程颜色')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '工作日程颜色')[0].value as string
      return val
    }
    return '#6CC598'
  }
  get restEventColor(): String {
    if (this.findProperties(PropertyGroupName.special, '休息日程颜色')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '休息日程颜色')[0].value as string
      return val
    }
    return '#F7B74F'
  }

  get showMode(): string {
    if (this.findProperties(PropertyGroupName.special, '默认显示面板')[0]) {
      const val = this.findProperties(PropertyGroupName.special, '默认显示面板')[0].value as any
      return val === '月' ? 'month' : 'year'
    }
    return 'month'
  }
  calenderEvents: CalendarEventsInfo[] = [] //日程数据源，展示的是条，一个月几条日程，是跨天的时间。
  calenderEventsDayByDay: any[] = [] //展示的日程数据源，一个月的每天的日程，下标为当月每天，没有的就是空
  currentMonthView: Number = 0 //当前展示面板是哪个月的
  currentYearView: Number = 2020
  resEditCalenderEvents: CalendarEventsInfo[] = [] //编辑的日程数据
  originalDataSource: any[] = [] //原始日程数据源
  isInnerChangeDataSource: boolean = false //内部改变了数据源
  // popTrigger: string = 'hover' //气泡展示方式，默认是hover，如果触发编辑就变成focus
  // get calenderEvents(): CalendarEventsInfo[] {
  //   if (this.findProperties(PropertyGroupName.special, '日程')[0]) {
  //     const events = this.findProperties(PropertyGroupName.special, '日程')[0].value as CalendarEventsInfo[]
  //     return events
  //   }
  //   return this.eventInit
  // }

  /**
   * 双击日程名称修改方法
   */
  // private onEventTitleDoubleClick(value: CalendarEventsInfo) {
  //   if (this.isModifyEventTitle) {
  //     value.isEdit = true
  //   }
  // }

  // private onEventTitleInputBlur(value: CalendarEventsInfo) {
  //   window.console.info('修改日程名称--------------------', value)
  //   value = this.modifyEventTitle(value)
  // }

  // private getDayOfMonth(value: moment) : Number

  private modifyEventTitle(value: CalendarEventsInfo): CalendarEventsInfo {
    let isDifferent = false

    //处理暂存的编辑数据
    this.calenderEvents.forEach((element, index) => {
      this.calenderEventsDayByDay.forEach((viewElement) => {
        viewElement.forEach((innerEle) => {
          if (innerEle.id == value.id && innerEle.eventTitle != value.eventTitle) {
            innerEle.eventTitle = value.eventTitle
          }
        })
      })

      if (value.eventTitle && value.eventTitle != this.originalDataSource[index].eventTitle) {
        if (element.id == value.id) {
          // element.eventTitle = value.eventTitle
          let isRes = false
          this.resEditCalenderEvents.forEach((item) => {
            if (item.id == value.id) {
              isRes = true
              item.eventTitle = value.eventTitle //替换已有的编辑的数据
            }
          })
          if (!isRes) {
            this.resEditCalenderEvents.push(value) //将编辑的数据存在这里
          }
          isDifferent = true
        }
      } else {
        element.eventTitle = this.originalDataSource[index].eventTitle
        value.eventTitle = this.originalDataSource[index].eventTitle
        //window.console.log('名称为空/名称无变化---------------------------', this.originalDataSource, this.calenderEvents)
        isDifferent = false
        value.isEdit = false
      }
    })
    if (isDifferent) {
      let property = this.findPropertyByName(PropertyGroupName.special, '日程数据源')
      this.setPropertyVal(property.id, this.calenderEvents)
      this.isInnerChangeDataSource = true

      let propertyEdit = this.findPropertyByName(PropertyGroupName.special, '编辑日程数据源')
      this.setPropertyVal(propertyEdit.id, { modelCode: this.getModelCode(), data: this.resEditCalenderEvents })
    }
    return value
  }

  private closePop(value: CalendarEventsInfo) {
    //window.console.info('--------------------------------------closePop--------------------', value)
    value.popVisible = false
    value.popTrigger = 'hover'
  }
  private onMouseEnterPop(value: CalendarEventsInfo) {
    //window.console.info('--------------------------------------悬浮日程--------------------', value)
    value.popVisible = true
  }

  //获取要渲染的日程内容,格子渲染的时候调用，
  // private getListData(value: Moment, events: CalendarEventsInfo[]): any[] {
  //   value.hour(0)
  //   value.minute(0)
  //   value.second(0)
  //   let listData: CalendarEventsInfo[] = []
  //   window.console.log('------------渲染的日程内容-------------')
  //   // if (this.IsDesigning) {
  //   //   events = this.eventInit()
  //   // }
  //   events.forEach((item) => {
  //     let startMoment = Vue.prototype.$moment(item.startDate)
  //     let endMoment = Vue.prototype.$moment(item.endDate)
  //     // const tempPopTrigger = 'hover'
  //     // const tempPopVisible = false
  //     // const tempIsEdit = false
  //     if (
  //       value.format('YYYY-MM-DD') === startMoment.format('YYYY-MM-DD') ||
  //       value.format('YYYY-MM-DD') === endMoment.format('YYYY-MM-DD') ||
  //       (value.isAfter(startMoment) && value.isBefore(endMoment))
  //     ) {
  //       let el: CalendarEventsInfo = new CalendarEventsInfo()
  //       el.popTrigger = 'hover'
  //       el.popVisible = false
  //       el.isEdit = false
  //       window.console.log('------------渲染的日程内容item-------------', item)
  //       window.console.log('------------渲染的日程内容eeeeee-------------', el)
  //       listData.push(el)
  //     }
  //   })

  //   return listData
  // }

  //切换日历显示模式（年/月）时触发
  private handlePanelChange() {
    this.$nextTick(function() {
      this.changeStyle()
    })
  }
  vue
  //选择展示年，月时触发,点击也会触发
  private handleChange(value) {
    if (
      (this.currentMonthView && this.currentMonthView != value.get('month')) ||
      (this.currentYearView && this.currentYearView != value.get('year'))
    ) {
      const selectYearMonth = Vue.prototype.$moment(value, 'YYYY-MM').valueOf()
      let property = this.findPropertyByName(PropertyGroupName.special, '当前选择年月')

      var val = { modelCode: this.getModelCode(), data: { start_date: selectYearMonth } }
      this.setPropertyVal(property.id, val)
      const selectYearMonthEnd = Vue.prototype
        .$moment(value)
        .endOf('month')
        .valueOf()
      const selectYearMonthStart = Vue.prototype
        .$moment(value)
        .startOf('month')
        .valueOf()
      let propertyStart = this.findPropertyByName(PropertyGroupName.special, '当前选择年月开始')
      this.setPropertyVal(propertyStart.id, selectYearMonthStart)
      let propertyEnd = this.findPropertyByName(PropertyGroupName.special, '当前选择年月结束')
      this.setPropertyVal(propertyEnd.id, selectYearMonthEnd)
      this.currentMonthView = Vue.prototype.$moment(propertyStart.value).get('month')
      //window.console.log('---------换页-----------查询i条件', propertyStart.value, propertyEnd.value)
      this.resEditCalenderEvents = []
      this.calenderEventsDayByDay = []
      this.triggeEvent('换页事件', null)
    }
  }

  getModelCode() {
    let tempModelCode = ''
    var prop = this.findPropertyByName(PropertyGroupName.special, '日程数据源')
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        if (modelInfo) {
          tempModelCode = modelInfo.modelBindingInfo.modelCode
        }
      }
    }
    return tempModelCode
  }

  private formatTime(time: Number, formatStr: string) {
    return Vue.prototype.$moment(time).format(formatStr)
  }
  //计算给定值的农历
  private getLunar(date: Moment) {
    const dayCurrentMomnet = date
    const dayCurrent = dayCurrentMomnet.format('YYYY-MM-DD')
    const weekCurrent = dayCurrent.toString().substring(0, 3)
    const today = new Date()
    today.setHours(0)
    today.setSeconds(0)
    today.setMinutes(0)
    // const dayCurrentMomnet = Vue.prototype.$moment(dayCurrent)
    const lastDayMoment = moment(dayCurrent).subtract(1, 'days') //moment的加减法会改变被减数，因此这里不能直接用dayCurrentMomnet计算
    const lunarObj = solarLunar.solar2lunar(dayCurrentMomnet.get('year'), dayCurrentMomnet.get('month') + 1, dayCurrentMomnet.get('date'))
    const lastDayLunarObj = solarLunar.solar2lunar(lastDayMoment.get('year'), lastDayMoment.get('month') + 1, lastDayMoment.get('date'))
    const p = lunarObj.isTerm ? lunarObj.term : lastDayLunarObj.monthCn != lunarObj.monthCn ? lunarObj.monthCn : lunarObj.dayCn
    return p
  }

  private changeStyle() {
    $(this.$el)
      .find('.ant-popover')
      .css('z-index', '100')

    $(this.$el)
      .find('.ant-fullcalendar-month')
      .css('height', 'fit-content')
    //去掉月份中日历的头部按钮
    // $(this.$el)
    //   .find('.ant-fullcalendar-month')
    //   .find('.ant-fullcalendar-header')
    //   .css('display', 'none')
    $(this.$el)
      .find('.ant-fullcalendar-month')
      .children('.ant-fullcalendar-content')
      .css('height', 'fit-content')
    //去掉插槽
    $(this.$el)
      .find('.ant-fullcalendar-month')
      .find('.ant-fullcalendar-date')
      .children('.ant-fullcalendar-content')
      .css('display', 'none')
    $(this.$el)
      .find('.ant-fullcalendar-month-panel-cell')
      .find('.ant-fullcalendar-date')
      .css('height', 'fit-content')
    $(this.$el)
      .find('.ant-fullcalendar-month-panel-cell')
      .find('.ant-fullcalendar-date')
      .css('padding', '0px 4px')
    $(this.$el)
      .find('.ant-fullcalendar-column-header')
      .css('padding-bottom', '2px')
    $(this.$el)
      .find('.ant-fullcalendar-cell')
      .css('padding', '0px 4px')
    $(this.$el)
      .find('.ant-fullcalendar-value')
      .css('height', '12px')
    $(this.$el)
      .find('.ant-fullcalendar-value')
      .css('line-height', '12px')
    $(this.$el)
      .find('.ant-fullcalendar-calendar-body')
      .css('padding', '2px 12px')
    $(this.$el)
      .find('.ant-fullcalendar-table')
      .css('height', 'fit-content ')
    $(this.$el)
      .find('.ant-fullcalendar-month-panel-cell')
      .css('padding', '0px')
    const dateHeight = this.height / 7
    $(this.$el)
      .find('.ant-fullcalendar-fullscreen .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-date')
      .css('height', dateHeight + 'px')
    // let property = this.findPropertyByName(PropertyGroupName.special, '显示切换按钮')
    // if (property && property.value) {
    //   $(this.$el)
    //     .find('.ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group')
    //     .css('display', '')
    // } else if (property && !property.value) {
    $(this.$el)
      .find('.ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group')
      .css('display', 'none')
    // }
  }

  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase) {
    if (property.propertyName === '前景色') {
      $(this.$el)
        .find('.ant-fullcalendar-value')
        .css('color', property.value)
    } else if (property.propertyName === '背景色') {
      $(this.$el)
        .find('.ant-fullcalendar-fullscreen')
        .css('background-color', property.value)
    } else if (property.propertyName === '高度') {
      const dateHeight = property.value / 7
      $(this.$el)
        .find('.ant-fullcalendar-fullscreen .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-date')
        .css('height', dateHeight + 'px')
    } else if (property.propertyName === '日程数据源') {
      if (property.value) {
        let tempData = []
        //window.console.log('----------------------改变数据源   ', property.value)

        property.value.forEach((item) => {
          let tempRow = common.clone(item)
          //公式转换之后日期可能会变成字符串
          if (tempRow.startDate && !isNaN(tempRow.startDate)) {
            tempRow.startDate = parseInt(tempRow.startDate)
          }
          if (tempRow.endDate && !isNaN(tempRow.endDate)) {
            tempRow.endDate = parseInt(tempRow.endDate)
          }
          if (tempRow.endDatte && !isNaN(tempRow.endDatte)) {
            //公式转换导致字段名字多了  t
            tempRow.endDate = parseInt(tempRow.endDatte)
          }
          if (tempRow.startTime && !isNaN(tempRow.startTime)) {
            tempRow.startTime = parseInt(tempRow.startTime)
          }
          if (tempRow.endTime && !isNaN(tempRow.endTime)) {
            tempRow.endTime = parseInt(tempRow.endTime)
          }

          // const workEventColorValue = this.findPropertyByName(PropertyGroupName.special, '工作日程颜色').value
          if (tempRow.status) {
            if (tempRow.status.constructor == Object) {
              const status = tempRow.status
              tempRow.color = status.itemValue == 1 ? this.workEventColor : this.restEventColor
              tempRow.status = status.itemValue == 1 ? '上班' : '休息'
            } else {
              const status = JSON.parse(tempRow.status)
              tempRow.color = status.itemValue == 1 ? this.workEventColor : this.restEventColor
              tempRow.status = status.itemValue == 1 ? '上班' : '休息'
            }
          } else {
            //window.console.info(this.workEventColor, this.workEventColor)
            tempRow.color = this.workEventColor
          }

          tempRow.popTrigger = tempRow.popTrigger ? tempRow.popTrigger : 'hover'
          tempRow.popVisible = tempRow.popVisible ? tempRow.popVisible : false
          tempRow.isEdit = tempRow.isEdit ? tempRow.isEdit : false
          tempData.push(tempRow)
        })
        this.calenderEvents = common.clone(tempData)
        if (!this.isInnerChangeDataSource) {
          this.calenderEventsDayByDay = []
          this.dayByDayChange(tempData)
          this.cleanAllEdit()

          //外界改变数据源才赋值，内部改变不赋值，保证originalDataSource是最原始的数据源
          this.originalDataSource = property.value
          //window.console.log('----------------------外界改变数据源   ', this.originalDataSource)
          this.isInnerChangeDataSource = false
        }
      } else {
        this.calenderEvents = []
      }
    }
  }
  //外部数据源变更时触发
  private dayByDayChange(events: CalendarEventsInfo[]) {
    let propertyStart = this.findPropertyByName(PropertyGroupName.special, '当前选择年月开始')
    let currentMonthStart = propertyStart.value
    const monthDay = Vue.prototype.$moment(currentMonthStart).daysInMonth()
    this.currentMonthView = Vue.prototype.$moment(propertyStart.value).get('month')
    this.currentYearView = Vue.prototype.$moment(propertyStart.value).get('year')
    //window.console.log('---------daybyday转换-------------当月,天数-----------', this.currentMonthView, monthDay)

    for (let i = 0; i <= monthDay; i++) {
      const value = Vue.prototype.$moment(currentMonthStart).set('date', i)
      let temp = []
      events.forEach((item) => {
        let startMoment = Vue.prototype.$moment(item.startDate)
        let endMoment = Vue.prototype.$moment(item.endDate)
        // const tempPopTrigalse
        if (
          value.format('YYYY-MM-DD') === startMoment.format('YYYY-MM-DD') ||
          value.format('YYYY-MM-DD') === endMoment.format('YYYY-MM-DD') ||
          (value.isAfter(startMoment) && value.isBefore(endMoment))
        ) {
          //window.console.log('------------渲染的日程内容item-------------', item)
          temp.push(common.clone(item))
        }
      })
      this.calenderEventsDayByDay.push(temp)
    }
    //window.console.log('------------渲染的日程内容-------------', this.calenderEventsDayByDay)
  }

  private saveAllEdit() {
    if (this.resEditCalenderEvents.length != 0) {
      this.calenderEvents.forEach((element) => {
        element.isEdit = false
        element.popTrigger = 'hover'
      })
      this.calenderEventsDayByDay.forEach((element) => {
        element.forEach((innerEle) => {
          innerEle.isEdit = false
          innerEle.popTrigger = 'hover'
        })
      })
      this.resEditCalenderEvents = []
      //window.console.log('---------------保存全部,清空编辑数据缓存------------------')
    } else {
      //window.console.log('---------------当前没有编辑数据------------------')
    }
  }

  private cleanAllEdit() {
    if (this.resEditCalenderEvents.length != 0) {
      this.calenderEvents.forEach((element) => {
        element.isEdit = false
        element.popTrigger = 'hover'

        this.originalDataSource.forEach((item) => {
          if (element.id == item.id && element.eventTitle != item.eventTitle) {
            element.eventTitle = item.eventTitle
          }
        })
      })
      this.calenderEventsDayByDay.forEach((element) => {
        element.forEach((innerEle) => {
          innerEle.isEdit = false
          innerEle.popTrigger = 'hover'

          this.originalDataSource.forEach((item) => {
            if (innerEle.id == item.id && innerEle.eventTitle != item.eventTitle) {
              innerEle.eventTitle = item.eventTitle
            }
          })
        })
      })
      this.resEditCalenderEvents = []
      //window.console.log('---------------取消全部,清空编辑数据缓存------------------')
    } else {
      //window.console.log('---------------当前没有编辑数据------------------')
    }
  }

  mounted() {
    this.width = 1000
    this.height = 600
    this.$nextTick(function() {
      this.changeStyle()
    })
    this.registerProperty('日程数据源', PropertyGroupName.special, null, null)
    this.registerProperty('当前选择年月', PropertyGroupName.special, null, null)
    this.registerProperty('当前选择年月开始', PropertyGroupName.special, null, null)
    this.registerProperty('当前选择年月结束', PropertyGroupName.special, null, null)
    this.registerProperty('当前选中日程', PropertyGroupName.special, null, null)
    this.registerProperty('编辑日程数据源', PropertyGroupName.special, null, null, false, false)
    this.registerProperty('当前选中日期', PropertyGroupName.special, null, null)
    this.registerProperty('默认显示面板', PropertyGroupName.special, new Enum_Property(true, ['月', '年']), '月')
    this.registerProperty('显示农历', PropertyGroupName.special, new Boolean_Property(), true)

    // this.registerProperty('显示切换按钮', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('工作日程颜色', PropertyGroupName.special, new Color_Property(), '#6CC598')
    this.registerProperty('休息日程颜色', PropertyGroupName.special, new Color_Property(), '#F7B74F')
    this.registerProperty('日程前景色', PropertyGroupName.special, new Color_Property(), true)
    // this.registerProperty('是否允许双击修改名称', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('日程名称是否可编辑', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否显示编辑按钮', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否显示删除按钮', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否显示保存按钮', PropertyGroupName.special, new Boolean_Property(), true)
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)

    this.registerEvents('点击日期事件', '', this.inparam, this.outparam)
    this.registerEvents('点击日程事件', '', this.inparam, this.outparam)
    this.registerEvents('保存日程事件', '', this.inparam, this.outparam)
    this.registerEvents('编辑日程事件', '', this.inparam, this.outparam)
    this.registerEvents('删除日程事件', '', this.inparam, this.outparam)
    this.registerEvents('换页事件', '', this.inparam, this.outparam)
    this.registerMethods('保存当前编辑', '', this.saveCurrentEdit, [{ name: '入参', type: paramType.string, val: null }], null)
    this.registerMethods('保存全部编辑', '', this.saveAllEdit, this.inparam, null)
    this.registerMethods('取消全部编辑', '', this.cleanAllEdit, this.inparam, null)
    this.registerMethods('获取编辑日程数据', '', this.getUpdatedDataSource, this.inparam, null)

    //初始为当前月
    this.currentMonthView = Vue.prototype.$moment(Vue.prototype.$moment().value).get('month')
    this.currentYearView = Vue.prototype.$moment(Vue.prototype.$moment().value).get('year')
    const selectYearMonthEnd = Vue.prototype
      .$moment()
      .endOf('month')
      .valueOf()
    const selectYearMonthStart = Vue.prototype
      .$moment()
      .startOf('month')
      .valueOf()
    let propertyStart = this.findPropertyByName(PropertyGroupName.special, '当前选择年月开始')
    this.setPropertyVal(propertyStart.id, selectYearMonthStart)
    let propertyEnd = this.findPropertyByName(PropertyGroupName.special, '当前选择年月结束')
    this.setPropertyVal(propertyEnd.id, selectYearMonthEnd)
    //window.console.log('--------------------当前选择年月开始111111111', propertyStart.value)

    //初始化绑定日程数据源模型
    let idproperty = this.findPropertyByName(PropertyGroupName.normal, '唯一Id')
    const this_ = this
    CurrentApis.GetModelInfoByCode('calendar_events').then((res: any) => {
      let modelInfo = {
        modelName: res.modelName,
        modelCode: res.modelCode,
        id: res.id,
        modelDataType: res.modelType,
        modelPropertyList: res.modelPropertyList
      }
      let newmodelbind: modelBingding = new modelBingding()
      newmodelbind.modelDataType = modelDataTypeEnum.single
      newmodelbind.modelBindingType = 1
      newmodelbind.modelBindingName = modelInfo.modelName + '-' + idproperty.value
      newmodelbind.modelBindingInfo = { name: modelInfo.modelName, modelCode: modelInfo.modelCode, modelId: modelInfo.id }
      // newmodelbind.modelDetailInfo = modelInfo

      let modelBind = this_.parentPage.modelBindings.find((o) => o.modelBindingName == newmodelbind.modelBindingName)
      if (!modelBind) {
        this_.parentPage.addModelBinding(newmodelbind)
        let arr = []
        modelInfo.modelPropertyList.forEach((element) => {
          arr.push({ code: element.propertyCode, codeName: element.propertyName, modelId: null })
        })

        let newbindInfo1 = new bindingModelVal_InProperty()
        newbindInfo1.bindType = bindTypeEnum.code
        newbindInfo1.modelCodes = arr
        newbindInfo1.modelName = newmodelbind.modelBindingName
        newbindInfo1.propertyId = this_.findPropertyByName(PropertyGroupName.special, '日程数据源').id
        this_.addPropertyModelBind(newbindInfo1)
      }
    })
  }

  updated() {
    //window.console.log('update------------------------')
    this.$nextTick(function() {
      this.changeStyle()
    })
    //初始为当前月
    this.currentMonthView = Vue.prototype.$moment(Vue.prototype.$moment().value).get('month')
    this.currentYearView = Vue.prototype.$moment(Vue.prototype.$moment().value).get('year')
    const selectYearMonthEnd = Vue.prototype
      .$moment()
      .endOf('month')
      .valueOf()
    const selectYearMonthStart = Vue.prototype
      .$moment()
      .startOf('month')
      .valueOf()
    let propertyStart = this.findPropertyByName(PropertyGroupName.special, '当前选择年月开始')
    this.setPropertyVal(propertyStart.id, selectYearMonthStart)
    let propertyEnd = this.findPropertyByName(PropertyGroupName.special, '当前选择年月结束')
    this.setPropertyVal(propertyEnd.id, selectYearMonthEnd)
    //window.console.log('--------------------当前选择年月开始111111111', propertyStart.value)
  }

  // @Emit('editEvents')
  private editEvents(event: CalendarEventsInfo) {
    if (this.eventTitleEditable) {
      event.isEdit = true
      event.popTrigger = 'focus'
    } else {
      event.isEdit = false
      event.popTrigger = 'hover'
    }

    let property = this.findPropertyByName(PropertyGroupName.special, '当前选中日程')
    // const selectModel = this.originalDataSource.filter((element) => element.id == event.id)
    this.setPropertyVal(property.id, { modelediteCode: this.getModelCode(), data: event })
    //window.console.log('-----------编辑日程--------', event)
    this.triggeEvent('编辑日程事件', null)
  }

  //外部触发的保存事件
  private saveEvents(event: CalendarEventsInfo) {
    this.triggeEvent('保存日程事件', event)
  }

  //真正保存的方法
  private saveCurrentEdit(paramArr: any[]) {
    if (!paramArr || !paramArr[0]) {
      return
    }
    let event: CalendarEventsInfo = new CalendarEventsInfo()
    for (let i = 0; i < this.calenderEventsDayByDay.length; i++) {
      let eventArr = this.calenderEventsDayByDay[i].filter((ele) => {
        return ele.id == paramArr[0].id
      })
      if (eventArr.length != 0) {
        event = eventArr[0]
        break
      }
    }

    event.isEdit = false
    event.popTrigger = 'hover'
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选中日程')
    this.setPropertyVal(property.id, { modelCode: this.getModelCode(), data: event })
    //window.console.log('-----------保存前缓存--------', this.resEditCalenderEvents)

    let eventClone: CalendarEventsInfo = common.clone(event)
    if (this.resEditCalenderEvents.length == 0) {
      this.resEditCalenderEvents.push(eventClone)
    } else {
      for (let i = 0; i < this.resEditCalenderEvents.length; i++) {
        if (this.resEditCalenderEvents[i].id == event.id) {
          this.resEditCalenderEvents[i].eventTitle = event.eventTitle
          break
        }
        if (i == this.resEditCalenderEvents.length - 1) {
          this.resEditCalenderEvents.push(eventClone)
        }
      }
    }

    //window.console.log('-----------保存后缓存--------', this.resEditCalenderEvents)
    //window.console.log('-----------保存日程--------', event)
    this.modifyEventTitle(event)
  }

  private cancelEvent(event: CalendarEventsInfo) {
    event.isEdit = false
    event.popTrigger = 'hover'
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选中日程')
    this.setPropertyVal(property.id, { modelCode: this.getModelCode(), data: event })
    //window.console.log('-----------取消前缓存--------', this.resEditCalenderEvents)

    let thisIsfirstEdit = true
    //如果不是第一次编辑了，就还原到上一次编辑后的数据
    this.resEditCalenderEvents.forEach((item) => {
      if (event.id == item.id && event.eventTitle != item.eventTitle) {
        event.eventTitle = item.eventTitle
        thisIsfirstEdit = false
      }
    })
    //如果是第一次编辑了，就还原到原始的数据
    if (thisIsfirstEdit) {
      this.originalDataSource.forEach((item) => {
        if (event.id == item.id && event.eventTitle != item.eventTitle) {
          event.eventTitle = item.eventTitle
        }
      })
    }

    //window.console.log('-----------取消后缓存--------', this.resEditCalenderEvents)
    //window.console.log('-----------取消日程--------', event)
    //this.triggeEvent('保存日程事件', null)
  }

  // @Emit('deleteEvents')
  private deleteEvents(event: CalendarEventsInfo) {
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选中日程')
    // const selectModel = this.originalDataSource.filter((element) => element.id == event.id)
    this.setPropertyVal(property.id, { modelCode: this.getModelCode(), data: event })
    //window.console.log('-----------删除日程--------', event)
    this.triggeEvent('删除日程事件', null)
  }

  // 废弃
  private clickEvents(event: CalendarEventsInfo) {
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选中日程')
    // const selectModel = this.originalDataSource.filter((element) => element.id == event.id)
    this.setPropertyVal(property.id, event)
    //window.console.log('-----------点击日程--------', event)
    this.triggeEvent('点击日程事件', null)
  }

  // @Emit('handleSelect')
  private handleSelect(value: Moment) {
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选中日期')
    const selectModel = { start_date: value.valueOf(), end_date: value.valueOf() }
    this.setPropertyVal(property.id, selectModel)
    //window.console.log('-----------点击日期--------', selectModel)
    this.triggeEvent('点击日期事件', null)
  }

  //获取编辑数据源
  getUpdatedDataSource() {
    let prop = this.findPropertyByName(PropertyGroupName.special, '编辑日程数据源')
    if (prop.value && prop.value.data && prop.value.data instanceof Array && prop.value.data.length > 0) {
      return prop.value.data
    } else if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return prop.value
    } else {
      return null
    }
    //return this.getDataSourceByType(operationTypeEnum.update)
  }
}
</script>

<style scoped>
.ant-fullcalendar-content {
  overflow-y: hidden;
}

.events {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 50%;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 12px;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
li {
  margin: 2px 0px;
  text-align: left;
}
.month-calendar {
  height: 100%;
}
.lunar {
  font-size: 12px;
  height: 20%;
}
.li-title {
  white-space: nowrap;
}
</style>