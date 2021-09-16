<template>
  <div
    class="chart"
    ref="chart" 
  >
    <div class="locationTop" :style="{width:locationWidth*3+30+'px',height:dateHeaderHeight+'px'}"></div>
    <div class="locationAll" :style="{width:locationWidth*3+2+'px',height:dateHeaderHeight*0.7+'px',top:dateHeaderHeight*0.15+'px',border:'1px solid'+locationBorderColor}"> 
       
        <div class="location" ref="locationDay" :style="{width:locationWidth+'px','border-right':'1px solid'+locationBorderColor,background:locationBGColor,
        'font-size': loactionFontSize+'px !important','font-weight': locationFontWeight+' !important','line-height':dateHeaderHeight*0.7+'px',}" 
        @click="locateDate('day')">日</div>

        <div class="location" ref="locationWeek" :style="{width:locationWidth+'px',left:locationWidth+'px','border-right':'1px solid'+locationBorderColor,background:'white',
        'font-size': loactionFontSize+'px !important','font-weight': locationFontWeight+' !important','line-height':dateHeaderHeight*0.7+'px',}" 
        @click="locateDate('week')">周</div>

        <div class="location" ref="locationMonth" :style="{width:locationWidth+'px',left:locationWidth*2+'px',background:'white',
        'font-size': loactionFontSize+'px !important','font-weight': locationFontWeight+' !important','line-height':dateHeaderHeight*0.7+'px',}" 
        @click="locateDate('month')">月</div>

    </div >
       
    
    <div
      ref="chartDate"
      class="chart-date"
      :style="{width:chartDateWidth+'px',height:(chartDateHeight-2)+'px',border:'0px 1px 1px 0px solid '+dateBorderColor}"
    > 
      
      <date
        :date-header-height="dateHeaderHeight"
        :date-header-font-size="dateHeaderFontSize"
        :date-header-font-weight="dateHeaderFontWeight"
        :date-header-color="dateHeaderColor"
        :date-border-color="dateBorderColor"
        :date-background-color="dateBackgroundColor"
        :show-non-weekday="isshowNonWeekday"
        :weekday-b-g-color="weekdayBGColor"
        :all-days="allDaysGantt"
        :all-days-mon-and-sun="allDaysGanttMonAndSun"
        :days-gantt-mon-and-sun="daysGanttMonAndSun"
        :year-month-day-hour-combine="yearMonthDayHourCombine"
        :current-day-size="currentDaySize"
        :weekends-height="chartAllHeight"
      />  
      <div
        ref="chartBody"
        class="chart-body"
        :style="{width:currentChartBodyWidth+'px',height:currentChartBodyHeight-heightBrowser+5+'px',top:dateHeaderHeight*2+1+'px',
        background:backgroundColor}" 
        @scroll="moveUp_left()"
      >
          <!-- <template v-if="showNonWeekday==true"> -->
        
        <!-- </template> -->
        <gridLine
          ref="gridLine"
          :task-list.sync="taskList"
          :current-day-size="currentDaySize"
          :date-total-width="dateTotalWidth"
          :gantt-start-date="ganttStartDate"
          :gantt-end-date="ganttEndDate"
          :time-div-date="timeDivDate"
          :chart-all-height="chartAllHeight"
          :row-height="rowHeight"
          :active-show-value="activeShowValue"
          :work-b-g-color="workBGColor" 
          :holiday-b-g-color="holidayBGColor"
          :split-line-color="splitLineColor"
          :vertical-split-line-color="verticalSplitLineColor"
          :odd-task-background-color="oddTaskBackgroundColor" 
          :even-task-background-color="evenTaskBackgroundColor" 
          :project-background-color="projectBackgroundColor"
          :middle-background-color="middleBackgroundColor"
          :task-click-color="taskClickColor"
          :task-hover-color="taskHoverColor"
          :spe-work-color="speWorkColor"
          :spe-rest-color="speRestColor"

          :weekday-b-g-color="weekdayBGColor"
          :all-days="allDaysGantt"
          :all-days-mon-and-sun="allDaysGanttMonAndSun"
          :year-month-day-hour-combine="yearMonthDayHourCombine"
          
          :show-non-weekday="showNonWeekday"
          :gantt-calendar="ganttCalendar"
          :calendar-level="calendarLevel"
          :work-time-type="workTimeType"
          :rest-b-g-color="restBGColor"

          @leftTableClickRow="leftTableClickRow"
          @leftTableHoverRow="leftTableHoverRow"
          @leftTableLeaveRow="leftTableLeaveRow"
         
        />
      
        <dependencyLines
          v-if="isDepend"
          :task-list="taskList"
          :row-height="rowHeight"
          :active-show-value="activeShowValue"
          :dependency-ref="dependencyRef"
          :row-height-model="rowHeightModel"
          :set-row-in-height-t="setRowInHeightT"
          :set-row-in-height-s="setRowInHeightS"
          :set-first-top="setFirstTop"
          :dependency-width="dependencyWidth"
          @ref-ok="refOK"
          :dependency-color="dependencyColor" 
        />
        <rowWrapper
          ref="wrapper" 
          :task-list.sync="taskList"
          :active-show-value="activeShowValue"
          :current-day-size="currentDaySize"
          :is-show-msg.sync="isShowMsg"
          :current-project-msg.sync="currentProjectMsg"
          :date-total-width="dateTotalWidth"
          :redo-list.sync="redoList"
          :undo-list.sync="undoList"
          :disable="disable"
          :gantt-move="ganttMove"
          :gantt-start-date="ganttStartDate"
          :row-height="rowHeight"
          :color-list="colorList"
          :date-header-height="dateHeaderHeight"
          :drap-depen="drapDepen"
          :row-height-model="rowHeightModel"
          :set-first-top="setFirstTop"
          :set-row-in-height-t="setRowInHeightT"
          :set-row-in-height-s="setRowInHeightS"
          :set-line-two-top="setLineTwoTop"
          :is-use-default-popup="isUseDefaultPopup"
          :pop-form="popForm"
          :summary-able="summaryAble"
          :filter="filter"
          @dblclickRowWrapper="dblclickRowWrapper"
          @clickRowWrapper="clickRowWrapper"
          @mouseover="mouseover"
          @rightClickRowWrapper="rightClickRowWrapper"
        />
        
      </div>
    </div>
    <div
      ref="shade" 
      style="overflow-y:auto;overflow-x:hidden;position:absolute;z-index:5"
      :style="{width:scrollWidth+'px',height:chartDateHeight-dateHeaderHeight*2 -scrollHeight+'px',left:chartDateWidth-scrollLeft+'px',top:dateHeaderHeight*2+1+'px'}"
      @scroll="moveUp_right()"
    >
      <div
        style="position:absolute;"
        :style="{width:10+'px',height:chartAllHeight+'px'}"
      >
&nbsp;
      </div>
    </div>
    <rowPopover
      ref="popover"
      :is-show-msg="isShowMsg"
      :current-project-msg="currentProjectMsg"
      :is-popover-show="isPopoverShow"
      :chart-date-width="chartDateWidth"
      :pop-msg-list="popMsgList"
    />
    <doubleModel ref="doubleModel" :task-list="taskList" :disable="disable"></doubleModel>
  
    <!-- <div class="chooseLevel">
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('hour',50,1,50,5*60*1000,false)">时1</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('hour',50,2,50,10*60*1000,false)">时2</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('hour',50,3,50,15*60*1000,false)">时3</a-button>

      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('day',70,4,70,60*60*1000,false)">天4</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('day',70,5,70,2*60*60*1000,false)">天5</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('day',70,6,70,4*60*60*1000,false)">天6</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('day',70,7,70,6*60*60*1000,false)">天7</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('day',70,8,70,8*60*60*1000,false)">天8</a-button>

      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('week',20,9,20,24*60*60*1000,false)">周9</a-button>

      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('month',40,10,40,24*60*60*1000,false)">月10</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('month',10,11,70,7*24*60*60*1000,false)">月11</a-button>

      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('year',50,12,50,365/12*24*60*60*1000,false)">年12</a-button>
      <a-button type="default" size="small" style="left:'10px'" @click="handleSetDaySize('year',100,13,100*4,365*24*60*60*1000,false)">年13</a-button> -->
       <!-- 选择时间范围：<a-range-picker @change="handlerChange" style="margin-right:50px">
      </a-range-picker>
      <a-button type="default" size="small" style="margin-left:'5px';right:'50px'" @click="handlerDateRangOnChange(chooseDate)">确定</a-button>
      <div style="width:200px">
        <a-slider :min="1" :max="13" :step="1" :defaultValue="5" :tooltipVisible="false" @change="changeDaySize"></a-slider>
      </div>
      
      
      缩放到合适：
      <a-icon style="left:5px" type="fullscreen" theme="outlined" @click="zoomToFit()" />
      <br>
      <a-icon class="reundo" type="undo" @click="undo()" />
      <a-icon class="reundo" type="redo" @click="redo()" />
      <a-button type="default" @click="testAdd">新增</a-button>
      <a-button type="default" @click="testDe">新增依赖</a-button>
      <a-button type="default" @click="testDelete">删除</a-button>
      <a-button type="default" @click="testExchange">交换</a-button>
      <a-button type="default" @click="changeDisable">是否可编辑</a-button>
      <a-button type="default" @click="testMoveTo">移动</a-button>
      <a-button type="default" @click="testChange">编辑内容</a-button>
      <a-button type="default" @click="activeShow">是否展示实际任务条</a-button>
      <a-button type="default" @click="popoverShow">是否显示泡泡窗</a-button>
      <a-button type="default" @click="testExpand">收起展开</a-button>
    </div> -->
  </div>
</template>

<script>
import date from './date.vue'
import weekend from './weekend.vue'
import rowWrapper from './rowWrapper.vue'
import gridLine from './gridLine.vue'
import dependencyLines from './dependencyLines.vue'
import rowPopover from './rowPopover.vue'
import doubleModel from './doubleModel.vue'
import XEUtils from 'xe-utils'
export default {
  components: {
    date: date,
    // weekend:weekend,
    rowWrapper: rowWrapper,
    gridLine: gridLine,
    dependencyLines: dependencyLines,
    rowPopover: rowPopover,
    doubleModel: doubleModel,
  },
  props: [
    'backgroundColor',
    'timeDivDate',
    'chartDateWidth', //甘特图的宽度
    'chartDateHeight', //甘特图高度

    'dateHeaderHeight', //日期头每层的高度
    'dateHeaderFontSize', //日期头字体大小
    'dateHeaderFontWeight', //日期头字体的粗细
    'dateHeaderColor', //日期头字体的颜色

    'dateBackgroundColor', //日期的背景颜色
    'splitLineColor', //分割线的颜色
    'verticalSplitLineColor', //纵向分割线颜色
    'oddTaskBackgroundColor', //奇数任务行颜色
    'evenTaskBackgroundColor', //偶数任务行颜色
    'projectBackgroundColor', //project任务行颜色
    'middleBackgroundColor', //middle任务行颜色
    'taskClickColor', //任务行鼠标选中颜色
    'taskHoverColor', //任务行鼠标悬停颜色

    'showNonWeekday', //是否显示周六周日
    'weekdayBGColor', //周六周日的背景颜色
    'workBGColor', //非工作时间颜色
    'holidayBGColor', //节假日的背景色

    'activeShowValue',
    'disable',
    'rowHeight',
    'dateBorderColor',
    'task',
    'colorList', //甘特图任务条颜色 （预计、实际、完成的百分比）
    'dependencyColor', //甘特图依赖线的颜色
    'drapDepen',

    'rowHeightModel', //是否自动设置任务条高度
    'setFirstTop', //预计任务条和顶部的高度
    'setRowInHeightT', //展示实际任务条时预计任务条的高度
    'setRowInHeightS', //不展示实际任务条时预计任务条的高度
    'setLineTwoTop', //预计任务条和实际任务条的距离

    'isUseDefaultPopup', //是否使用默认弹窗（当鼠标悬浮在任务条上时）
    'popForm', //气泡卡片内容
    'ganttCalendar', //工厂日历
    'calendarLevel', //工厂日历级别
    'summaryAble', //是否展示汇总信息
    'restBGColor',
    'isDepend', //是否展示依赖线
    'ganttMove', //
    'speWorkColor', //
    'speRestColor',
    'filter',
    'workTimeType',
    'dependencyWidth',

    'loactionFontSize', //快速定位的字体大小
    'locationFontWeight', //快速定位的字体粗细
    'locationWidth', //快速定位的宽度
    'locationBorderColor', //快速定位的边框颜色
    'locationBGColor', //快速定位的背景色
  ],
  data() {
    return {
      isshowNonWeekday: false,
      ganttStartDate: '2019-3-1', //甘特图的开始日期
      ganttEndDate: '2019-11-15', //甘特图的结束日期

      chooseDate: [], //日期快速定位的日期范围

      allDaysGanttMonAndSun: [], // 开始日期所在周的周一 到 结束时期所在周的周日  范围内的所有年月日
      daysGanttMonAndSun: [], //所有天数

      yearMonthDayHourCombine: [], //存放年月日的组合：比如 2019年10月28日01时，为了提高日期等级为时 显示的速度
      allDaysGantt: [], // 开始结束日期范围内的所有年月日
      daysGantt: [], //所有的天数

      monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], //月数

      hourArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], //小时数

      currentDaySize: {
        //当前显示的日期级别
        label: 'day',
        value: 80,
        level: 4,
        actualValue: 80, ////
        time: 60 * 60 * 1000, ////
      },

      daySize: {},

      //////////////////////////////////////
      dateTotalWidth: 1200,
      taskList: [],
      isShowMsg: false,
      currentProjectMsg: {
        id: 0,
        taskName: '',
        allTime: 0,
        percentage: 0,
        planBeginTime: 0,
        planEndTime: 0,
        left: 0,
        top: 0,
        dateList: [{ key: '当前进度：', value: 0 }],
      },
      redoList: [],
      undoList: [],
      dependencyRef: false,
      isPopoverShow: true,
      //////////////////////////
      isTaskChange: false,
      isScrolleLeft: true,
      isScrolleRight: true,
      timer: '',
      currentBrowser: '', //当前浏览器
      scrollWidth: 8, //当前浏览器对应的滑块宽度
      scrollHeight: 10,
      scrollLeft: 9, //当前浏览器对应的滑块离左侧距离
      heightBrowser: 0, //当前浏览器对应的横向滑块离上方留空大小
      minStartTime: 0, //所有任务的最小开始时间（最小开始时间与最小实际开始时间取最小值）
      maxEndTime: 0, //所有任务的最大开始时间（最大开始时间与最大实际开始时间取最大值）
      popMsgList: {},
      selfProperty: ['top', 'left', 'widthMe', 'widthChild', 'gridForm', 'lineDates', 'actualLeft', 'actualWidthMe', 'actualWidthChild'],
      showList: [], //用于存储展开数据
      // popForm:[{
      //   text:'planBeginTime',
      //   type:'time',
      //   formate:'YYYY-MM-DD hh:mm:ss',
      // },{
      //   text:'planEndTime',
      //   type:'time',
      //   formate:'YYYY-MM-DD hh:mm:ss',
      // }],
    }
  },
  computed: {
    currentYear() {
      //当前年份
      return new Date().getFullYear()
    },

    currentMonth() {
      //当前月份
      return new Date().getMonth() + 1
    },

    currentDay() {
      //当前日
      return new Date().getDate()
    },

    //将taskList里的层级变为一层
    computedList() {
      let arr = []
      this.computedListOne(this.taskList, arr)
      return arr
    },

    //设置内部div高度
    currentChartBodyHeight() {
      if (this.dateTotalWidth + 20 <= this.chartDateWidth) {
        return this.chartDateHeight - this.dateHeaderHeight * 2 + 3
      } else {
        return this.chartDateHeight - this.dateHeaderHeight * 2 - 20 + 3
      }
    },
    //设置内部div宽度
    currentChartBodyWidth() {
      if (this.chartAllHeight > this.chartDateHeight - this.dateHeaderHeight * 2 - this.scrollWidth) {
        return this.dateTotalWidth + this.scrollWidth - 1
      } else {
        return this.dateTotalWidth
      }
    },
    //显示的任务的总高度
    chartAllHeight() {
      let height = 0
      this.computedList.forEach((k, index) => {
        if (k.isShow) {
          height += this.rowHeight
        }
      })
      return height
    },
  },

  methods: {
    computedListOne(item, list) {
      item.forEach((child) => {
        list.push(child)
        if (child.children && child.children.length > 0) {
          this.computedListOne(child.children, list)
        }
      })
    },

    getComputedListIndexShow(item) {
      var index = 0
      for (var i = 0; i < this.computedList.length; i++) {
        if (this.computedList[i].isShow) {
          if (item.id === this.computedList[i].id) {
            return index
          } else {
            index++
          }
        }
      }
      return -1
    },

    //获取当前的浏览器类型
    getCurrentBrowser() {
      let userAgent = navigator.userAgent
      if (userAgent.indexOf('Opera') > -1) {
        this.currrentBrowser = 'Opera'
        //return "Opera"
      } else if (userAgent.indexOf('Firefox') > -1) {
        this.currrentBrowser = 'Firefox'
        this.scrollWidth = 27
        this.scrollHeight = 22
        this.scrollLeft = this.scrollWidth + 1.5 //3
        this.heightBrowser = 5
        //return "Firefox"
      } else if (userAgent.indexOf('Chrome') > -1) {
        this.currrentBrowser = 'Chrome'
        this.scrollWidth = 18
        this.scrollHeight = 18
        this.scrollLeft = this.scrollWidth + 1
        this.heightBrowser = 0
        // return "Chrome"
      } else if (userAgent.indexOf('Safari') > -1) {
        this.currrentBrowser = 'Safari'
        // return "Safari"
      } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && userAgent.indexOf('Opera') <= -1) {
        this.currrentBrowser = 'IE'
        // return "IE"
      } else if (userAgent.indexOf('Trident') > -1) {
        this.currrentBrowser = 'Edge'
        this.scrollWidth = 15
        this.scrollHeight = 18
        this.scrollLeft = this.scrollWidth + 3
        this.heightBrowser = 0
        // return "Edge"
      }
    },
    moveUp_right() {
      if (this.isScrolleRight) {
        this.isScrolleLeft = false
        this.$refs.chartBody.scrollTop = this.$refs.shade.scrollTop
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.isScrolleLeft = true
        }, 500)

        this.$emit('handleTableScroll', this.$refs.shade.scrollTop)
      }
    },
    moveUp_left() {
      if (this.isScrolleLeft) {
        this.isScrolleRight = false
        this.$refs.shade.scrollTop = this.$refs.chartBody.scrollTop
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.isScrolleRight = true
        }, 500)

        this.$emit('handleTableScroll', this.$refs.chartBody.scrollTop)
      }
    },
    //双击任务条
    dblclickRowWrapper(task) {
      // this.$refs.doubleModel.view(task)
      this.$emit('dblclickRowWrapper', task)
    },
    //选中任务条
    clickRowWrapper(task) {
      this.$emit('clickRowWrapper', task)
    },
    rightClickRowWrapper(task) {
      this.$emit('rightClickRowWrapper', task)
    },
    leftTableClickRow(task) {
      this.$emit('leftTableClickRow', task)
    },
    leftTableHoverRow(task) {
      this.$emit('leftTableHoverRow', task)
    },
    leftTableLeaveRow(task) {
      this.$emit('leftTableLeaveRow', task)
    },
    //悬浮任务条
    mouseover(item) {
      this.$emit('mouseover', item)
    },
    //获取修改后的数据源
    getResultTask() {
      var saveTask = [...this.taskList]
      this.getResultTaskOne(saveTask)
      return saveTask
    },
    getResultTaskOne(item) {
      item.forEach((child) => {
        delete child.actualLeft
        delete child.actualWidthChild
        delete child.actualWidthMe
        delete child.gridForm
        delete child.isShow
        delete child.left
        delete child.planTime
        delete child.top
        delete child.widthChild
        delete child.widthMe
        delete child.isexpand
        if (child.children && child.children.length > 0) {
          // delete child.percentage
          this.getResultTaskOne(child.children)
        }
      })
    },
    computedYearMonthDayHour() {
      let obj = {}
      let count = 0
      this.yearMonthDayHourCombine = []
      this.allDaysGantt.forEach((item) => {
        Object.keys(item.month[0]).forEach((element) => {
          item.month[0][element].forEach((day) => {
            this.hourArr.forEach((hour) => {
              count++
              obj.indexKey = count
              obj.year = item.year
              obj.month = parseInt(element)
              obj.date = day.date
              obj.weekday = day.weekday
              obj.hour = hour
              obj.all = item.year + '年' + element + '月' + day.date + '日' + (hour >= 10 ? hour : '0' + hour) + '时'
              this.yearMonthDayHourCombine.push(obj)
              obj = {}
            })
          })
        })
      })
      //return arr
    },
    getMonDay(ganttStartDate) {
      //获取开始日期所在周 的周一的日期
      let arr = ganttStartDate.split('-')
      let dateOfWeek = new Date(arr[0], arr[1] - 1, arr[2]).getDay() //返回当前日期的在当前周的某一天（0～6--周日到周一）
      let dateOfWeekInt = parseInt(dateOfWeek, 10) //转换为整型
      if (dateOfWeekInt == 0) {
        //如果是周日
        dateOfWeekInt = 7
      }
      let monDay = parseInt(arr[2], 10) + (7 - dateOfWeekInt) - 6 //当前日期的周一的日期  7-dateOfWeekInt:当前于周末相差的天数
      let startDate = new Date(arr[0], arr[1] - 1, monDay)
      var sm = parseInt(startDate.getMonth(), 10) + 1 //月份+1 因为月份从0开始
      return startDate.getFullYear() + '-' + sm + '-' + startDate.getDate()
    },
    getSunDay(ganttEndDate) {
      //获取结束日期所在周 的周日的日期
      let arr = ganttEndDate.split('-')
      let date = new Date(arr[0], arr[1] - 1, arr[2]) //月份-1 因为月份从0开始 构造一个Date对象
      let dateOfWeekInt = parseInt(date.getDay(), 10) //转换为整型   date.getDay():返回当前日期的在当前周的某一天（0～6--周日到周一）
      if (dateOfWeekInt == 0) {
        //如果是周日
        dateOfWeekInt = 7
      }

      let sunDay = parseInt(arr[2], 10) + 7 - dateOfWeekInt //当前日期的周日的日期   7-dateOfWeekInt:当前于周末相差的天数
      let endDate = new Date(arr[0], arr[1] - 1, sunDay)
      let em = parseInt(endDate.getMonth()) + 1

      return endDate.getFullYear() + '-' + em + '-' + endDate.getDate()
    },
    getGanttDays() {
      let arr = this.getInitStartAndEndTime(2, 2)
      if (arr.length > 0) {
        this.ganttStartDate = arr[0]
        this.ganttEndDate = arr[1]
      } else {
        this.ganttStartDate = this.currentYear + '-' + this.currentMonth + '-1'
        this.ganttEndDate =
          this.currentYear + '-' + this.currentMonth + '-' + this.checkMonthDays(this.currentMonth, this.isLeapYear(this.currentYear))
      }
      this.getAllDateGantt(this.ganttStartDate, this.ganttEndDate, this.allDaysGantt, this.daysGantt) //获取开始结束日期范围内的所有年月日星期
      this.getAllDateGantt(
        this.getMonDay(this.ganttStartDate),
        this.getSunDay(this.ganttEndDate),
        this.allDaysGanttMonAndSun,
        this.daysGanttMonAndSun
      ) //获取开始结束日期范围内的所有年月日星期（包括开始日期的所在周，结束日期的所在周）

      this.computedYearMonthDayHour()
    },
    getAllDateGantt(startDate, endDate, allDaysGanttObject, daysGantt) {
      let obj = {}
      let arr = []
      let sd = [] //存放开始日期的 年 月 日
      let ed = [] //存放结束日期的 年 月 日

      startDate.split('-').forEach((item) => {
        sd.push(parseInt(item, 10))
      })
      endDate.split('-').forEach((item) => {
        ed.push(parseInt(item, 10))
      })

      for (let i = sd[0]; i <= ed[0]; i++) {
        arr.push(i)
      }

      //甘特图日期范围中所在的年份
      arr.forEach((item) => {
        obj.year = item
        obj.days = this.isLeapYear(item) ? 366 : 365 //每年的天数（与具体的月日无关）
        allDaysGanttObject.push(obj)
        obj = {}
      })

      this.handleMonthDayGantt(sd, ed, allDaysGanttObject)

      daysGantt = this.handleDays(daysGantt)
    },
    //获取 月份、月份天数、日、日所对应的星期几
    handleMonthDayGantt(sd, ed, allDaysGanttObject) {
      //sd：甘特图开始日期的 年 月 日 数组，ed：结束日期的 年 月 日 数组
      //比如：2017-10-1 到 2020-7-8

      allDaysGanttObject.forEach((item) => {
        let arrMonth = []
        let objMonth = {}
        let acutualDays = 0
        //不同年 开始日期所在的年份
        if (item.year == sd[0] && item.year != ed[0]) {
          //甘特图开始日期中所在年份包含的月份 ，比如：2017年包含的月份
          for (let i = sd[1]; i <= 12; i++) {
            if (i == sd[1]) {
              objMonth[i] = this.checkMonthDays(i, item.days) - sd[2] + 1
            } else {
              objMonth[i] = this.checkMonthDays(i, item.days)
            }
            acutualDays = acutualDays + objMonth[i]
          }
          arrMonth.push(objMonth)
          let s = arrMonth[0]
          for (let element in s) {
            if (element == sd[1]) {
              s[element] = this.addNum(sd[2], s[element], element, item.year, true)
            } else {
              s[element] = this.addNum(1, s[element], element, item.year, true)
            }
          }
          item.acutualDays = acutualDays
          item.month = arrMonth
        }

        //不同年 结束日期所在的年份
        else if (item.year != sd[0] && item.year == ed[0]) {
          //甘特图结束日期中所在年份包含的月份 比如：2020年包含的月份
          for (let i = 1; i <= ed[1]; i++) {
            if (i == ed[1]) {
              objMonth[i] = ed[2]
            } else {
              objMonth[i] = this.checkMonthDays(i, item.days)
            }
            acutualDays = acutualDays + objMonth[i]
          }
          arrMonth.push(objMonth)
          let s = arrMonth[0]
          for (let element in s) {
            s[element] = this.addNum('', s[element], element, item.year, false)
          }
          item.acutualDays = acutualDays
          item.month = arrMonth
        }

        //同一年
        else if (item.year == sd[0] && item.year == ed[0]) {
          //同一个月
          if (sd[1] == ed[1]) {
            objMonth[sd[1]] = ed[2] - sd[2] + 1
            acutualDays = objMonth[sd[1]]
          } else {
            for (let i = sd[1]; i <= ed[1]; i++) {
              if (i == sd[1]) {
                objMonth[i] = this.checkMonthDays(i, item.days) - sd[2] + 1
              } else if (i == ed[1]) {
                objMonth[i] = ed[2]
              } else {
                objMonth[i] = this.checkMonthDays(i, item.days)
              }
              acutualDays = acutualDays + objMonth[i]
            }
          }

          arrMonth.push(objMonth)
          let s = arrMonth[0]
          let index = 0
          for (let element in s) {
            if (index == 0) {
              s[element] = this.addNum(sd[2], s[element], element, item.year, true)
            } else {
              s[element] = this.addNum(1, s[element], element, item.year, true)
            }
            index++
          }
          item.acutualDays = acutualDays
          item.month = arrMonth
        } else {
          //甘特图开始和结束日期范围内所在年份包含的月份，比如：2018、2019年包含的月份
          for (let i = 1; i <= 12; i++) {
            objMonth[i] = this.checkMonthDays(i, item.days)
          }
          arrMonth.push(objMonth)
          let s = arrMonth[0]
          for (let element in s) {
            s[element] = this.addNum('', s[element], element, item.year, false)
          }
          item.acutualDays = item.days
          item.month = arrMonth
        }
      })
    },

    //获取甘特图日期范围内的所有的天，已经对应的日和星期几
    handleDays(allDaysGantt) {
      let arr = []
      let days = []
      allDaysGantt.forEach((item) => {
        arr = arr.concat(item.month)
      })
      arr.forEach((item) => {
        for (var j in item) {
          days = days.concat(item[j])
        }
      })
      return days
    },
    handlerDateRangOnChange(dateString) {
      //日期范围选定后触发的时间
      Date.prototype.diff = function(date) {
        return (this.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
      }
      var st = new Date(dateString[0])
      var en = new Date(dateString[1])
      var diff = en.diff(st) + 1

      let start0 = this.ganttStartDate.split('-')
      let start = []
      start0.forEach((element) => {
        start.push(parseInt(element, 10))
      })

      let startString = start[0] + '-' + (start[1] >= 10 ? start[1] : '0' + start[1]) + '-' + (start[2] >= 10 ? start[2] : '0' + start[2])

      var da = st.diff(new Date(startString)) //计算和甘特图的开始时间相差的天数（实际的日期）   new Date中日期格式为2019-01-05
      var daWeek = st.diff(new Date(this.getMonDay(this.ganttStartDate))) //计算和甘特图的开始时间相差的天数(实际日期加上开始结束日期所在的周，周级9、月的周级11)
      var daMonth = st.diff(new Date(start[0] + '-' + start[1] + '-01')) //计算和甘特图的开始时间相差的天数(实际日期加上开始结束日期所在的周，周级9、月的周级11)
      var daYear = st.diff(new Date(start[0] + '-01-01')) //计算和甘特图的开始时间相差的天数(实际日期加上开始结束日期所在的年，年级13， 开始日期所在年的1月1日)
      //this.$refs.chartDate.scrollTo(0, 0)

      if (this.chartDateWidth / (24 * diff) >= 40) {
        this.handleSetDaySize('day', this.chartDateWidth / (24 * diff), 4, this.chartDateWidth / (24 * diff), 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * da, 0)
      } else if (this.chartDateWidth / (12 * diff) >= 40) {
        this.handleSetDaySize('day', this.chartDateWidth / (12 * diff), 5, this.chartDateWidth / (12 * diff), 2 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * da, 0)
      } else if (this.chartDateWidth / (6 * diff) >= 40) {
        this.handleSetDaySize('day', this.chartDateWidth / (6 * diff), 6, this.chartDateWidth / (6 * diff), 4 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * da, 0)
      } else if (this.chartDateWidth / (4 * diff) >= 40) {
        this.handleSetDaySize('day', this.chartDateWidth / (4 * diff), 7, this.chartDateWidth / (4 * diff), 6 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * da, 0)
      } else if (this.chartDateWidth / (3 * diff) >= 40) {
        this.handleSetDaySize('day', this.chartDateWidth / (3 * diff), 8, this.chartDateWidth / (3 * diff), 8 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * da, 0)
      } else if (this.chartDateWidth / diff >= 20) {
        this.handleSetDaySize('month', this.chartDateWidth / diff, 10, this.chartDateWidth / diff, 24 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * da, 0)
      } else if ((this.chartDateWidth / diff) * 7 >= 20) {
        this.handleSetDaySize('month', this.chartDateWidth / diff, 11, (this.chartDateWidth / diff) * 7, 7 * 24 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * daWeek, 0)
      } else if ((this.chartDateWidth / diff) * 30 >= 30) {
        this.handleSetDaySize('year', (this.chartDateWidth / diff) * 30, 12, (this.chartDateWidth / diff) * 30, 365 * 24 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * daMonth, 0)
      } else if ((this.chartDateWidth / diff) * 90 >= 30) {
        this.handleSetDaySize('year', (this.chartDateWidth / diff) * 90, 13, (this.chartDateWidth / diff) * 90, 365 * 24 * 60 * 60 * 1000, true)
        this.$refs.chartDate.scrollTo((this.chartDateWidth / diff) * daYear, 0)
      }
    },
    handlerChange(date, dateString) {
      this.chooseDate = dateString
    },
    changeDaySize(value) {
      console.log('开始修改')
      //滑块滑动时的更改日期level
      let currentLabel = ''
      let currentValue = 0
      let currentActualValue = 0
      let currentTime = 0
      if (value == 1 || value == 2 || value == 3) {
        currentLabel = 'hour'
        currentValue = 50
        currentActualValue = 50
        currentTime = value * 5 * 60 * 1000
      }
      if (value == 4 || value == 5 || value == 6 || value == 7 || value == 8) {
        currentLabel = 'day'
        currentValue = 70
        currentActualValue = 70
        if (value == 4) {
          currentTime = 60 * 60 * 1000
        } else {
          currentTime = 2 * (value - 4) * 60 * 60 * 1000
        }
      }
      if (value == 9) {
        currentLabel = 'week'
        currentValue = 90
        currentActualValue = 90
        currentTime = 24 * 60 * 60 * 1000
      }
      if (value == 10 || value == 11) {
        currentLabel = 'month'
        if (value == 10) {
          currentValue = 40
          currentActualValue = 40
          currentTime = 24 * 60 * 60 * 1000
        } else {
          currentValue = 10
          currentActualValue = 10 * 7
          currentTime = 7 * 24 * 60 * 60 * 1000
        }
      }
      if (value == 12 || value == 13) {
        currentLabel = 'year'
        if (value == 12) {
          currentValue = 50
          currentActualValue = 600
          currentTime = (365 / 12) * 24 * 60 * 60 * 1000
        } else {
          currentValue = 100
          currentActualValue = 400
          currentTime = 365 * 24 * 60 * 60 * 1000
        }
      }

      // this.calculateDateTotalWidth()
      this.handleSetDaySize(currentLabel, currentValue, value, currentActualValue, currentTime, false)

      this.$refs.chartDate.scrollTo(this.dateTotalWidth / 2, 0)
    },
    zoomInOrOut(isUp) {
      let value = 0
      if (isUp) {
        value = this.currentDaySize.level + 1
      } else {
        value = this.currentDaySize.level - 1
      }

      if (value == 3) {
        this.handleSetDaySize('hour', 50, value, 50, value * 5 * 60 * 1000, false)
      }
      if (value == 4 || value == 5 || value == 6 || value == 7 || value == 8) {
        if (value == 4) {
          this.handleSetDaySize('day', 70, 4, 70, 60 * 60 * 1000, false)
        } else {
          this.handleSetDaySize('day', 70, value, 70, 2 * (value - 4) * 60 * 60 * 1000, false)
        }
      }
      if (value == 9) {
        this.handleSetDaySize('week', 90, 9, 90, 24 * 60 * 60 * 1000, false)
      }

      if (value == 10) {
        this.handleSetDaySize('month', 40, 10, 40, 24 * 60 * 60 * 1000, false)
      }
      if (value == 11) {
        this.handleSetDaySize('month', 10, 11, 10 * 7, 7 * 24 * 60 * 60 * 1000, false)
      }
      if (value == 12) {
        this.handleSetDaySize('year', 50, 12, 600, (365 / 12) * 24 * 60 * 60 * 1000, false)
      }
      if (value == 13) {
        this.handleSetDaySize('year', 100, 13, 400, 365 * 24 * 60 * 60 * 1000, false)
      }
    },

    handleSetDaySize(label, widthSize, level, actualValue, time, isDateRangeChange) {
      //isDateRangeChange:是否是改变日期显示范围（true/false）
      //更改daySize
      // console.log("进入handleSetDaySize")
      //  console.log("level:",level)
      //   console.log("this.currentDaySize.level:",this.currentDaySize.level)
      this.currentDaySize.label = label
      this.currentDaySize.value = widthSize
      this.currentDaySize.level = level
      this.currentDaySize.actualValue = actualValue
      this.currentDaySize.time = time
      //console.log('this.currentDaySize.level后：', this.currentDaySize.level)
      this.calculateDateTotalWidth()
      if (this.dateTotalWidth < this.chartDateWidth) {
        this.calculateVaueByChartDateWidth()
        this.calculateDateTotalWidth()
      }

      this.$nextTick(() => {
        //添加这个会导致快速定位日期范围失效，因为handlerCheckList方法中修改了chartDate.scrollLeft，因为handlerCheckList需添加一个参数来管控
        this.$refs.wrapper.handlerCheckList(isDateRangeChange)
        this.$refs.gridLine.handleColorDueToDateChange() //为了解决切换等级时，选中的行中特殊时间和日期色块颜色还原了的问题
      })
    },

    calculateVaueByChartDateWidth() {
      //当宽度大于日期总长度时，重新计算每个日期的宽度
      let count = 0
      let days = 0
      this.allDaysGantt.forEach((item) => {
        days = days + item.acutualDays
      })
      switch (this.currentDaySize.level) {
        case 4:
          this.currentDaySize.value = this.chartDateWidth / (days * 24)
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 5:
          this.currentDaySize.value = this.chartDateWidth / (days * 12)
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 6:
          this.currentDaySize.value = this.chartDateWidth / (days * 6)
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 7:
          this.currentDaySize.value = this.chartDateWidth / (days * 4)
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 8:
          this.currentDaySize.value = this.chartDateWidth / (days * 3)
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 9:
          this.allDaysGanttMonAndSun.forEach((item) => {
            count = count + item.acutualDays
          })
          this.currentDaySize.value = this.chartDateWidth / count
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 10:
          this.currentDaySize.value = this.chartDateWidth / days
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 11:
          this.allDaysGanttMonAndSun.forEach((item) => {
            count = count + item.acutualDays
          })
          this.currentDaySize.value = this.chartDateWidth / count
          this.currentDaySize.actualValue = this.currentDaySize.value * 7
          break
        case 12:
          this.allDaysGantt.forEach((item) => {
            count = count + Object.keys(item.month[0]).length
          })
          this.currentDaySize.value = this.chartDateWidth / count
          this.currentDaySize.actualValue = this.currentDaySize.value
          break
        case 13:
          count = this.allDaysGantt.length
          this.currentDaySize.value = this.chartDateWidth / (count * 4)
          this.currentDaySize.actualValue = this.currentDaySize.value * 4
          break
      }

      this.calculateDateTotalWidth()
    },
    locateDate(label) {
      if (label == 'day') {
        this.$refs.locationDay.style.backgroundColor = this.locationBGColor
        this.$refs.locationWeek.style.backgroundColor = 'white'
        this.$refs.locationMonth.style.backgroundColor = 'white'
        this.handleSetDaySize('day', 80, 4, 80, 60 * 60 * 1000, false)
      } else if (label == 'week') {
        this.$refs.locationDay.style.backgroundColor = 'white'
        this.$refs.locationWeek.style.backgroundColor = this.locationBGColor
        this.$refs.locationMonth.style.backgroundColor = 'white'
        this.handleSetDaySize('week', 80, 9, 80, 24 * 60 * 60 * 1000, false)
      } else if (label == 'month') {
        this.$refs.locationDay.style.backgroundColor = 'white'
        this.$refs.locationWeek.style.backgroundColor = 'white'
        this.$refs.locationMonth.style.backgroundColor = this.locationBGColor
        this.handleSetDaySize('month', 80, 10, 80, 24 * 60 * 60 * 1000, false)
      }
    },
    isLeapYear(year) {
      //判断是否为闰年
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return true
      }
      return false
    },

    handleMonthDay(days, year) {
      let arr = []
      let obj = {}
      this.monthArr.forEach((item) => {
        obj[item] = this.checkMonthDays(item, days)
      })
      arr.push(obj)
      let s = arr[0]
      for (let item in s) {
        s[item] = this.addNum(s[item], item, year)
      }
      return arr
    },

    checkMonthDays(month, days) {
      //根据月份返回天数 :month 月份 days 天数
      let day
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31
          // eslint-disable-next-line no-unreachable
          break
        case 4:
        case 6:
        case 9:
        case 11:
          return 30
          // eslint-disable-next-line no-unreachable
          break
        case 2:
          day = days == 365 ? 28 : 29
          return day
          // eslint-disable-next-line no-unreachable
          break
      }
    },

    //startDay 这个月的开始日  num 这个月的实际总天数 month 月份 year 年份
    addNum(startDay, num, month, year, isStartDate) {
      let arr = []
      let obj = {}
      if (!isStartDate) {
        for (let i = 1; i <= num; i++) {
          obj.date = i
          obj.weekday = new Date(`${year}/ ${month} / ${i}`).getDay()
          arr.push(obj)
          obj = {}
        }
      } else {
        for (let i = startDay; i < startDay + num; i++) {
          obj.date = i
          obj.weekday = new Date(`${year}/ ${month} / ${i}`).getDay()
          arr.push(obj)
          obj = {}
        }
      }

      return arr
    },

    calculateDateTotalWidth() {
      //console.log('calculateDateTotalWidth进入了:')
      //console.log('this.currentDaySize.level:', this.currentDaySize.level)
      //计算日期总的宽度
      let days = 0
      this.allDaysGantt.forEach((item) => {
        days = days + item.acutualDays
      })
      let daysMonAndSun = 0
      this.allDaysGanttMonAndSun.forEach((item) => {
        daysMonAndSun = daysMonAndSun + item.acutualDays
      })

      if (this.currentDaySize.level == 1) {
        this.dateTotalWidth = this.currentDaySize.value * days * 24 * 12
      }
      if (this.currentDaySize.level == 2) {
        this.dateTotalWidth = this.currentDaySize.value * days * 24 * 6
      }
      if (this.currentDaySize.level == 3) {
        this.dateTotalWidth = this.currentDaySize.value * days * 24 * 4
      }
      if (this.currentDaySize.level == 4) {
        this.dateTotalWidth = this.currentDaySize.value * days * 24
      }
      if (this.currentDaySize.level == 5) {
        this.dateTotalWidth = this.currentDaySize.value * days * 12
      }
      if (this.currentDaySize.level == 6) {
        this.dateTotalWidth = this.currentDaySize.value * days * 6
      }
      if (this.currentDaySize.level == 7) {
        this.dateTotalWidth = this.currentDaySize.value * days * 4
      }
      if (this.currentDaySize.level == 8) {
        this.dateTotalWidth = this.currentDaySize.value * days * 3
      }
      if (this.currentDaySize.level == 9 || this.currentDaySize.level == 11) {
        this.dateTotalWidth = this.currentDaySize.value * daysMonAndSun
      }
      if (this.currentDaySize.level == 10) {
        this.dateTotalWidth = this.currentDaySize.value * days
      }
      if (this.currentDaySize.level == 12) {
        this.dateTotalWidth = 0
        this.allDaysGantt.forEach((item) => {
          this.dateTotalWidth = this.dateTotalWidth + this.currentDaySize.value * Object.keys(item.month[0]).length
        })
      }
      if (this.currentDaySize.level == 13) {
        this.dateTotalWidth = this.currentDaySize.value * 4 * this.allDaysGantt.length
      }
      //console.log('this.currentDaySize.level:', this.currentDaySize.level)
    },

    //分组是否展开
    handlerExpand(id, isexpand, list, fafil) {
      var tList = null
      var isFirst = false
      if (list) {
        tList = list
      } else {
        tList = this.taskList
        isFirst = true
      }
      var flag = false
      var count = 0
      tList.forEach((child) => {
        var fil = true
        if (!fafil) {
          fil = this.handlerFilter(child)
        }
        if (child.id === id) {
          flag = true
          count = this.countChild(child, true, fafil, fil)
          child.isexpand = isexpand
          this.$set(child, 'isexpand', isexpand)
          this.changShow(child, isexpand, fafil, fil)

          this.$emit('handleColorDueToExpand', child) //为了解决移动时右侧鼠标离开不及时的问题（因为拖动后默认收起）
        } else {
          if (flag) {
            var topDistance = 0
            if (isexpand) {
              topDistance += count * this.rowHeight
            } else {
              topDistance -= count * this.rowHeight
            }
            child.top += topDistance
            this.changTop(child, topDistance)
          } else {
            if (child.children && child.children.length > 0) {
              var result = this.handlerExpand(id, isexpand, child.children)
              flag = result.flag
              count = result.count
            }
          }
        }
      })
      if (flag) {
        this.Ref(true)
      }
      return { flag: flag, count: count }
    },

    countChild(taskItem, flag, fafil, fil) {
      var count = 0
      if (taskItem.children && taskItem.children.length > 0) {
        if (flag) {
          if (fafil || fil) count += taskItem.children.length
          else {
            taskItem.children.forEach((child) => {
              if (this.handlerFilter(child)) count++
            })
          }
        } else {
          if (taskItem.isexpand) {
            // count+=taskItem.children.length
            if (fafil || fil) count += taskItem.children.length
            else {
              taskItem.children.forEach((child) => {
                if (this.handlerFilter(child)) count++
              })
            }
          }
        }
        taskItem.children.forEach((child) => {
          count += this.countChild(child, false, fafil ? true : fil, this.handlerFilter(child))
        })
      }
      return count
    },

    changTop(taskItem, topDistance) {
      if (taskItem.children && taskItem.children.length > 0) {
        taskItem.children.forEach((child) => {
          child.top += topDistance
          this.changTop(child, topDistance)
        })
      }
    },

    changShow(taskItem, isShow, fafil, fil) {
      if (taskItem.children && taskItem.children.length > 0) {
        taskItem.children.forEach((child) => {
          var sefil = this.handlerFilter(child)
          if (isShow) {
            if (fafil || fil || sefil) {
              child.isShow = isShow
              this.$set(child, 'isShow', isShow)
            }
          } else if (isShow === false) {
            child.isShow = false
            this.$set(child, 'isShow', false)
          }
          if (child.children && child.children.length > 0) {
            if (child.isexpand === true) {
              this.changShow(child, isShow, fafil ? true : fil, sefil)
            }
            if (isShow && !child.isShow) {
              if (this.handlerFilterList(child)) {
                child.isShow = true
                this.$set(child, 'isShow', true)
              }
            }
          }
        })
      }
    },

    /**
     * @param {boolean} reduct 此行是否收起
     */
    //修改后续高度
    resetTop(preZindex, zindex, reduce) {
      let num = reduce ? -this.rowHeight : this.rowHeight
      let count = 0
      if (preZindex != -1) {
        this.taskList.forEach((item, index) => {
          if (index == preZindex) {
            item.children.forEach((child, i) => {
              if (i == zindex) {
                child.children.forEach((k, j) => {
                  count += num
                  k.top = k.top + count
                })
              } else if (i > zindex) {
                child.top = child.top + count
                if (child.children && child.children.length > 0) {
                  child.children.forEach((k, j) => {
                    k.top = k.top + count
                  })
                }
              }
            })
          } else if (index > preZindex) {
            item.top = item.top + count
            if (item.children && item.children.length > 0) {
              item.children.forEach((child, i) => {
                child.top = child.top + count
                if (child.children && child.children.length > 0) {
                  child.children.forEach((k, j) => {
                    k.top = k.top + count
                  })
                }
              })
            }
          }
        })
      } else {
        this.taskList.forEach((item, index) => {
          if (index == zindex) {
            item.children.forEach((child, i) => {
              count += num
              child.top = child.top + count
              if (child.children && child.children.length > 0) {
                if (child.isexpand) {
                  child.children.forEach((k, j) => {
                    count += num
                    k.top = k.top + count
                  })
                } else {
                  child.children.forEach((k, j) => {
                    k.top = k.top + count
                  })
                }
              }
            })
          } else if (index > preZindex) {
            item.top = item.top + count
            if (item.children && item.children.length > 0) {
              item.children.forEach((child, i) => {
                child.top = child.top + count
                if (child.children && child.children.length > 0) {
                  child.children.forEach((k, j) => {
                    k.top = k.top + count
                  })
                }
              })
            }
          }
        })
      }
    },

    //是否符合过滤条件
    handlerFilter(row) {
      if (this.filter.length === 0) return true
      for (var i = 0; i < this.filter.length; i++) {
        var flag = true
        switch (this.filter[i].type) {
          case 'text':
            if (XEUtils.toString(row[this.filter[i].key]).indexOf(XEUtils.toString(this.filter[i].value)) < 0) flag = false
            break
          case 'date':
            if (this.filter[i].value.length === 1) {
              if (row[this.filter[i].key] > this.filter[i].value[0]) {
                flag = false
              }
            } else if (this.filter[i].value.length === 2) {
              if (row[this.filter[i].key] < this.filter[i].value[0] || row[this.filter[i].key] > this.filter[i].value[1]) {
                flag = false
              }
            }
            break
          default:
            if (
              row[this.filter[i].key] != null &&
              row[this.filter[i].key] != undefined &&
              XEUtils.toString(row[this.filter[i].key]).indexOf(XEUtils.toString(this.filter[i].value)) < 0
            )
              flag = false
            break
        }
        if (flag === false) {
          return false
        }
      }
      return true
    },

    handlerFilterList(row) {
      if (row.children && row.children.length > 0) {
        for (var i = 0; i < row.children.length; i++) {
          if (this.handlerFilter(row.children[i])) {
            return true
          } else {
            var res = this.handlerFilterList(row.children[i])
            if (res) return true
          }
        }
      } else {
        return false
      }
    },

    //根据任务的时间，缩放至合适
    zoomToFit() {
      this.handlerDateRangOnChange(this.getInitStartAndEndTime(1, 1))
    },
    getInitStartAndEndTime(startAddDayNum, endAddDayNum) {
      //获取任务最初的开始结束时间（数据中最小的startTime，和最大的endTime）
      // startAddDayNum:最初开始时间扩大的天数 endAddDayNum：最晚结束时间扩大的天数
      let timeArr = []
      if (this.computedList.length > 0) {
        let countS = 0
        let countE = 0
        let start = ''
        let end = ''

        let countActualS = 0
        let countActualE = 0
        let actualStart = ''
        let actualEnd = ''

        this.computedList.forEach((item) => {
          //获取最小开始时间、最小实际开始时间、最大结束时间、最大实际结束时间
          if (item.planBeginTime != '' && item.planBeginTime != undefined) {
            countS++
            if (countS == 1) {
              start = item.planBeginTime
            } else if (countS != 1 && item.planBeginTime < start) {
              start = item.planBeginTime
            }
          }
          if (item.planEndTime != '' && item.planEndTime != undefined) {
            countE++
            if (countE == 1) {
              end = item.planEndTime
            } else if (countE != 1 && item.planEndTime > end) {
              end = item.planEndTime
            }
          }
          if (item.actualBeginTime != '' && item.actualBeginTime != undefined) {
            countActualS++
            if (countActualS == 1) {
              actualStart = item.actualBeginTime
            } else if (countActualS != 1 && item.actualBeginTime < actualStart) {
              actualStart = item.actualBeginTime
            }
          }
          if (item.actualEndTime != '' && item.actualEndTime != undefined) {
            countActualE++
            if (countActualE == 1) {
              actualEnd = item.actualEndTime
            } else if (countActualE != 1 && item.actualEndTime > actualEnd) {
              actualEnd = item.actualEndTime
            }
          }
        })
        if (start != '' && actualStart != '') {
          //开始时间和实际开始时间中取最小值
          if (start > actualStart) {
            start = actualStart
          }
        }
        if (end != '' && actualEnd != '') {
          //结束时间和实际结束时间中取最大值
          if (end < actualEnd) {
            end = actualEnd
          }
        }

        this.minStartTime = start - startAddDayNum * 24 * 60 * 60 * 1000
        this.maxEndTime = end + endAddDayNum * 24 * 60 * 60 * 1000
        timeArr.push(this.msToDateFormat(start - startAddDayNum * 24 * 60 * 60 * 1000))
        timeArr.push(this.msToDateFormat(end + endAddDayNum * 24 * 60 * 60 * 1000))
      }
      return timeArr
    },
    msToDateFormat(time) {
      //毫秒转换为 年-月-日 格式

      let date = new Date(time)
      let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()

      return date.getFullYear() + '-' + month + '-' + day
    },

    /**
     * @param parentId 从属于哪个
     * @param task 内容
     * @param depen 依赖内容，每个对象分为两个部分，依赖（新增的任务）和被依赖（原有的任务）
     */
    //新增任务
    addNewTask(task, depen, index, type, list) {
      if (this.disable == false) return
      try {
        this.addNewTaskOne(task, depen, index, type, this.taskList)
      } catch (error) {
        if (error === 'have') {
          this.$message.info('当前信息已存在')
        } else if (error === 'over') {
          //
        } else {
          //window.console.log(error)
          throw error
        }
      }
    },

    addNewTaskOne(task, depen, index, type, list) {
      let result = this.$refs.wrapper.getTask(task.id)
      if (result.self) {
        this.$message.info('此信息已存在')
        throw 'have'
      }
      // if(result)
      let scroll1X = this.$refs.chartDate.scrollLeft
      let scroll1Y = this.$refs.chartDate.scrollTop
      let scroll2X = this.$refs.chartBody.scrollLeft
      let scroll2Y = this.$refs.chartBody.scrollTop
      let parentId
      let undoItem = {}
      //添加task
      if (!task.parentId) {
        if (index >= 0) {
          this.taskList.splice(index, 0, task)
        } else {
          this.taskList.push(task)
        }
        this.addDependency(depen)
        this.$nextTick(() => {
          this.$refs.wrapper.handlerCheckList(false)
        })
        if (type == 'add') {
          undoItem.type = 6
          undoItem.task = JSON.parse(JSON.stringify(task))
          undoItem.depen = depen
          this.undoList.push(undoItem)
        }
        this.isTaskChange = !this.isTaskChange
        this.$refs.chartDate.scrollLeft = scroll1X
        this.$refs.chartBody.scrollTop = scroll2Y
        this.$refs.shade.scrollTop = scroll2Y
        throw 'over'
      } else {
        parentId = task.parentId
        list.forEach((item) => {
          if (item.id == parentId) {
            if (!item.children) {
              item.children = []
            }
            if (index >= 0) {
              item.children.splice(index, 0, task)
            } else {
              if (item.parentId && item.type === 'task') {
                item.type = 'middle'
              } else if (item.type === 'task') {
                item.type = 'project'
              }
              item.children.push(task)
            }
            this.addDependency(depen)
            this.$nextTick(() => {
              this.$refs.wrapper.handlerCheckList(false)
            })
            if (type == 'add') {
              undoItem.type = 6
              undoItem.task = { ...task }
              undoItem.depen = depen
              undoItem.index = index
              this.undoList.push(undoItem)
              this.$parent.$refs.table.addNewTask({ ...undoItem.task }, undoItem.depen, undoItem.index, 'un', null)
            }
            this.isTaskChange = !this.isTaskChange
            this.$refs.chartDate.scrollLeft = scroll1X
            this.$refs.chartBody.scrollTop = scroll2Y
            this.$refs.shade.scrollTop = scroll2Y
            throw 'over'
          } else if (item.children && item.children.length > 0) {
            this.addNewTaskOne(task, depen, index, type, item.children)
          }
        })
      }
    },

    //添加依赖关系
    addDependency(depen, list) {
      if (this.disable == false) return
      if (depen === null) return
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.taskList
        flag = true
      }
      try {
        if (depen && depen.length > 0) {
          thisList.forEach((item) => {
            if (depen.length > 0) {
              for (let i = 0; i < depen.length; i++) {
                if (depen[i].to == item.id) {
                  if (item.dependOn && item.dependOn.length > 0) {
                    item.dependOn.push(depen[i].from)
                  } else {
                    item.dependOn = [depen[i].from]
                  }
                  depen.splice(i, 1)
                  i--
                } else if (depen.length > 0 && item.children && item.children.length > 0) {
                  this.addDependency(depen, item.children)
                }
              }
            } else throw '依赖添加完毕'
          })
        }
      } catch (error) {
        //window.console.log('error:', error)
      }
    },

    //删除task
    deleteTask(id, type, list, undoItem) {
      if (this.disable == false) return
      let result = this.$refs.wrapper.getTask(id)
      if (!result.self) return
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.taskList
        flag = true
      }
      let scrollX = this.$refs.chartDate.scrollLeft
      let scrollY = this.$refs.chartBody.scrollTop
      if (!undoItem) {
        undoItem = {}
        undoItem.type = 7
        undoItem.depen = []
      }
      for (let i = 0; i < thisList.length; i++) {
        if (thisList[i].id == id) {
          undoItem.task = { ...thisList[i] }
          undoItem.index = i
          thisList.splice(i, 1)
          i--
        } else {
          if (thisList[i].dependOn && thisList[i].dependOn.length > 0) {
            let index = thisList[i].dependOn.indexOf(id)
            if (index > -1) {
              undoItem.depen.push(thisList[i].id)
              thisList[i].dependOn.splice(index, 1)
            }
          }
          if (thisList[i].children && thisList[i].children.length > 0) {
            this.deleteTask(id, '', thisList[i].children, undoItem)
          }
        }
      }
      if (flag) {
        if (type == 'add') {
          // window.console.log('type===add&&flag')
          this.undoList.push(undoItem)
        }
        this.$parent.$refs.table.deleteTask(undoItem.task.id, 'un', null, null)
        this.$refs.wrapper.handlerCheckList(false)
        this.$refs.chartDate.scrollTo(scrollX, 0)
        this.$refs.chartBody.scrollTo(0, scrollY)
        this.$refs.shade.scrollTo(0, scrollY)
      }
    },

    //修改task
    changeTask(task, type, list) {
      // window.console.log('changeTask')
      // window.console.log(task)
      if (this.disable == false) return
      // let result = this.$refs.wrapper.getTask(task.id)
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.taskList
        flag = true
      }
      var index = -1
      let errorFlag = true
      thisList.forEach((child, i) => {
        if (child.id === task.id) {
          index = i
          if (type === 'add') {
            try {
              this.checkTask(task)
            } catch (error) {
              errorFlag = false
              if (error === 'start-error') {
                this.$message.info('上一个任务的开始时间不能晚于下一个任务的开始时间')
              } else if (error === 'end-error') {
                this.$message.info('后一个任务的开始时间不能超过上一个任务的开始时间')
              } else {
                throw error
              }
            }
          }
        }
      })
      if (index > -1) {
        // window.console.log('>-1')
        if (errorFlag) {
          let undoItem = { type: 8 }
          undoItem.oldTask = { ...thisList[index] }
          const linshiTask = { ...task }
          this.copyTask(thisList[index], linshiTask)
          if (type === 'add') {
            undoItem.newTask = { ...task }
            this.$parent.$refs.table.changeTask(undoItem.newTask, 're')
            this.undoList.push(undoItem)
          }
          this.isTaskChange = !this.isTaskChange

          return true
        } else {
          return false
        }
      } else {
        thisList.forEach((child) => {
          if (child.children && child.children.length > 0) {
            var result = this.changeTask(task, type, child.children)
            if (result === true) {
              this.$refs.wrapper.handlerFatherNode(child)
              return true
            }
          }
        })
      }
    },

    copyTask(oldTask, newTask) {
      for (let [key, value] of Object.entries(newTask)) {
        if (this.selfProperty.indexOf(key) < 0) {
          if (value != oldTask[key]) {
            oldTask[key] = value
          }
        }
      }
    },

    //交换两组任务条,目前只有最内层的任务条可以交换
    exchangeTask(idf, ids, type) {
      if (this.disable == false) return
      let scrollX = this.$refs.chartDate.scrollLeft
      let scrollY = this.$refs.chartBody.scrollTop
      let taskf = this.$refs.wrapper.getTask(idf)
      let tasks = this.$refs.wrapper.getTask(ids)
      if (taskf.deep == 2 && tasks.deep == 2) {
        for (let i = 0; i < this.taskList.length; i++) {
          if (i == taskf.graindex) {
            for (let j = 0; j < this.taskList[i].children.length; j++) {
              if (j == taskf.parindex) {
                this.taskList[i].children[j].children[taskf.index] = tasks.self
              }
            }
          }
          if (i == tasks.graindex) {
            for (let j = 0; j < this.taskList[i].children.length; j++) {
              if (j == tasks.parindex) {
                this.taskList[i].children[j].children[tasks.index] = taskf.self
              }
            }
          }
        }
      } else {
        return false
      }
      this.$refs.wrapper.handlerCheckList(false)
      if (type == 'add') {
        let undoItem = {}
        undoItem.type = 4
        undoItem.idf = idf
        undoItem.ids = ids
        this.undoList.push(undoItem)
      }
      this.$refs.chartDate.scrollTo(scrollX, 0)
      this.$refs.chartBody.scrollTo(0, scrollY)
      this.$refs.shade.scrollTo(0, scrollY)
      return true
    },

    /**
     * 检测是否允许移动
     */
    checkDrop(selfRow, prevRow, currRow, type, property) {
      let selfResult = this.$refs.wrapper.getTask(selfRow.id)
      let pareResult = this.$refs.wrapper.getTask(selfRow.parentId)
      let prevResult
      if (type === 'in') {
        prevResult = this.$refs.wrapper.getTask(prevRow.id)
      } else if (type === 'side') {
        prevResult = this.$refs.wrapper.getTask(prevRow.parentId)
      }
      let currResult = this.$refs.wrapper.getTask(currRow.id)
      let propertyJson = JSON.parse(property)
      let result = { result: true, selfResult: selfResult, prevResult: prevResult, currResult: currResult }
      if (prevResult.deep === pareResult.deep) {
        propertyJson.forEach((child) => {
          if (pareResult.self[child] != prevResult.self[child]) {
            result.result = false
          }
        })
      } else {
        result.result = false
      }
      return result
    },

    /**
     * 将某条数据移动到某个数组下或某条数据旁
     * selfRow：移动的数据
     * prevRow：选中的数据
     * currRow：当前数据
     * type：类型  in  side
     * list：选中数组，为null时是数据源
     */
    drop(selfRow, prevRow, currRow, type, rowIndex, list, thisType, result) {
      let scrollX = this.$refs.chartDate.scrollLeft
      let scrollY = this.$refs.chartBody.scrollTop
      // window.console.log(type)
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        flag = true
        thisList = this.taskList
        result = this.deleteOne(selfRow.id, list)
        result.newIndex = null
      }
      thisList.forEach((child) => {
        if (type === 'in') {
          if (prevRow.id === child.id) {
            selfRow.parentId = prevRow.id
            if (child.children && child.children.length > 0) {
              child.children.splice(0, 0, selfRow)
            } else {
              this.$set(child, 'children', [selfRow])
              this.$set(child.children[0], 'isShow', true)
            }
          } else if (child.children && child.children.length > 0) {
            this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result)
          }
        } else if (type === 'side') {
          if (prevRow.parentId === child.id) {
            selfRow.parentId = prevRow.parentId
            result.newIndex = rowIndex
            child.children.splice(rowIndex, 0, selfRow)
            this.$set(child.children[rowIndex], 'isShow', true)
          } else if (child.children && child.children.length > 0) {
            result.newIndex = this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result).newIndex
          }
        } else if (type === 'side-define') {
          if (prevRow.parentId === child.id) {
            selfRow.parentId = prevRow.parentId
            child.children.splice(rowIndex, 0, selfRow)
          } else if (child.children && child.children.length > 0) {
            this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result)
          }
        } else if (type === 'in-define') {
          if (prevRow.id === child.id) {
            selfRow.parentId = prevRow.id
            child.children.splice(rowIndex, 0, selfRow)
          } else if (child.children && child.children.length > 0) {
            this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result)
          }
        }
      })
      if (flag) {
        this.$refs.wrapper.handlerCheckList(false)
        if (thisType == 'add') {
          let undoItem = {}
          undoItem.type = 9
          if (type === 'in') {
            undoItem.dropType = 'in-define'
          } else if (type === 'side') {
            undoItem.dropType = 'side-define'
          }
          undoItem.selfRow = selfRow
          undoItem.prevRow = result.preRow
          undoItem.currRow = null
          undoItem.rowIndex = result.thisIndex
          undoItem.oldPrevRow = prevRow
          undoItem.newIndex = 0
          if (type === 'side') undoItem.newIndex = result.newIndex
          if (type === 'define') undoItem.newIndex = rowIndex
          undoItem.list = null
          this.undoList.push(undoItem)
        }
        this.$refs.chartDate.scrollTo(scrollX, 0)
        this.$refs.chartBody.scrollTo(0, scrollY)
        this.$refs.shade.scrollTo(0, scrollY)
      }
      return result
    },

    /**
     * 删除某条数据
     * selfRowId:删除数据Id
     * list：数据所在数组，为null时为数据源
     */
    deleteOne(selfRowId, list) {
      var thisList = []
      let result = { thisIndex: -1, preRow: null }
      if (list) {
        thisList = list
      } else {
        thisList = this.taskList
      }
      var index = -1
      thisList.forEach((child, i) => {
        if (child.id === selfRowId) {
          index = i
        } else {
          if (index === -1 && result.thisIndex === -1) {
            if (child.children && child.children.length > 0) {
              if (result.thisIndex > -1) {
                return result
              }
              result = this.deleteOne(selfRowId, child.children)
            }
          }
        }
      })
      if (index > -1) {
        result.preRow = { ...thisList[index] }
        result.thisIndex = index
        thisList.splice(index, 1)
      }
      return result
    },

    //移动任务条，仅最内层
    moveToTask(id, newParentId, index, type) {
      if (this.disable == false) return
      let result = this.$refs.wrapper.getTask(id)
      if (result.deep < 2) return
      let newResult = this.$refs.wrapper.getTask(newParentId)
      if (!newResult.self) return
      let item = JSON.parse(JSON.stringify(result.self))
      this.taskList[result.graindex].children[result.parindex].children.splice(result.index, 1)
      if (index && index <= this.taskList[newResult.parindex].children[newResult.index].children.length) {
        this.taskList[newResult.parindex].children[newResult.index].children.splice(index, 0, item)
      } else {
        this.taskList[newResult.parindex].children[newResult.index].children.push(item)
      }
      if (type == 'new') {
        let undoItem = {}
        undoItem.type = 5
        undoItem.id = id
        undoItem.newParentId = newParentId
        undoItem.oldParentId = result.parent.id
        if (index) {
          undoItem.newindex = index
        } else {
          undoItem.newindex = this.taskList[newResult.parindex].children[newResult.index].children.length - 1
        }
        undoItem.oldindex = result.index
        this.undoList.push(undoItem)
      }
      this.$refs.wrapper.handlerCheckList(false)
    },

    checkTask(task, list) {
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.taskList
        flag = true
      }
      thisList.forEach((child) => {
        if (child.dependOn && child.dependOn.indexOf(task.id) >= 0) {
          if (task.planBeginTime > child.planBeginTime) {
            throw 'end-error'
          }
        }
        if (task.dependOn && task.dependOn.indexOf(child.id) >= 0) {
          if (child.planBeginTime > task.planBeginTime) {
            throw 'start-error'
          }
        }
        if (child.children && child.children.length > 0) {
          this.checkTask(task, child.children)
        }
      })
    },

    //获取所有依赖关系和时间
    getDepen(task, list, result) {
      var thisList = []
      if (list) {
        thisList = list
      } else {
        thisList = this.taskList
        result = { before: [], after: [] }
      }
      thisList.forEach((child) => {
        if (child.dependOn && child.dependOn.indexOf(task.id) >= 0) {
          let item = { id: child.id, planBeginTime: child.planBeginTime, planEndTime: child.planEndTime }
          result.after.push(item)
        }
        if (task.dependOn && task.dependOn.indexOf(child.id) >= 0) {
          let item = { id: child.id, planBeginTime: child.planBeginTime, planEndTime: child.planEndTime }
          result.before.push(item)
        }
        if (child.children && child.children.length > 0) {
          this.getDepen(task, child.children, result)
        }
      })
      return result
    },

    //撤销
    undo() {
      if (this.disable == false) return
      // window.console.log('undo')
      if (this.undoList.length > 0) {
        let undoItem = this.undoList.pop()
        switch (undoItem.type) {
          case 0: //整体拖拽
            this.$refs.wrapper.reundoTime('old', undoItem)
            this.$parent.$refs.table.reundoTime('old', undoItem, null)
            break
          case 1: //拖拽左侧
          case 2: //拖拽右侧
            this.$refs.wrapper.reundoTime('old', undoItem)
            this.$parent.$refs.table.reundoTime('old', undoItem, null)
            break
          case 3: //百分比
            this.$refs.wrapper.reundoPer(undoItem.oldper, undoItem)
            break
          case 4: //交换
            this.exchangeTask(undoItem.ids, undoItem.idf, 'un')
            break
          case 5: //移动位置
            this.moveToTask(undoItem.id, undoItem.oldParentId, undoItem.oldindex, 'un')
            break
          case 6: //新增
            this.deleteTask(undoItem.task.id, 'un', null, null)
            this.$parent.$refs.table.deleteTask(undoItem.task.id, 'un', null, null)
            break
          case 7: //删除
            this.addNewTask(undoItem.task, undoItem.depen, undoItem.index, 'un', null)
            this.$parent.$refs.table.addNewTask(undoItem.task, undoItem.depen, undoItem.index, 'un', null)
            break
          case 8: //修改
            this.changeTask(undoItem.oldTask, 'un')
            this.$parent.$refs.table.changeTask(undoItem.oldTask, 'un', null)
            break
          case 9: //移动上下位置
            this.drop({ ...undoItem.selfRow }, undoItem.prevRow, null, 'side-define', undoItem.rowIndex, null, 'un')
            this.$parent.$refs.table.drop({ ...undoItem.selfRow }, undoItem.prevRow, null, 'side-define', undoItem.rowIndex, null, 'un')
            break
          default:
            break
        }
        this.redoList.push(undoItem)
        // this.$refs.wrapper.handlerCheckList()
      }
    },

    //重做
    redo() {
      if (this.disable == false) return
      if (this.redoList.length > 0) {
        let redoItem = this.redoList.pop()
        switch (redoItem.type) {
          case 0: //整体拖拽
            this.$refs.wrapper.reundoTime('new', redoItem)
            this.$parent.$refs.table.reundoTime('new', redoItem, null)
            break
          case 1: //拖拽左侧
          case 2: //拖拽右侧
            this.$refs.wrapper.reundoTime('new', redoItem)
            this.$parent.$refs.table.reundoTime('new', redoItem, null)
            break
          case 3: //百分比
            this.$refs.wrapper.reundoPer(redoItem.newper, redoItem)
            break
          case 4: //交换
            this.exchangeTask(redoItem.idf, redoItem.ids, 're')
            break
          case 5: //移动位置
            this.moveToTask(redoItem.id, redoItem.newParentId, redoItem.newindex, 're')
            break
          case 6: //增加
            this.addNewTask(redoItem.task, redoItem.depen, redoItem.index, 're', null)
            this.$parent.$refs.table.addNewTask(redoItem.task, redoItem.depen, redoItem.index, 're', null)
            break
          case 7: //删除
            this.deleteTask(redoItem.task.id, 're', null, null)
            this.$parent.$refs.table.deleteTask(redoItem.task.id, 're', null, null)
            break
          case 8: //修改
            this.changeTask(redoItem.newTask, 're')
            this.$parent.$refs.table.changeTask(redoItem.newTask, 're', null)
            break
          case 9: //移动上下位置
            this.drop({ ...redoItem.selfRow }, redoItem.oldPrevRow, null, redoItem.dropType, redoItem.newIndex, null, 're')
            this.$parent.$refs.table.drop({ ...redoItem.selfRow }, redoItem.oldPrevRow, null, redoItem.dropType, redoItem.newIndex, null, 're')
            break
          default:
            break
        }
        this.undoList.push(redoItem)
        // this.$refs.wrapper.handlerCheckList()
      }
    },

    //锁定产线
    lockNode(row, list) {
      if (list) {
        list.forEach((child) => {
          if (child.id === row[0].data.id) {
            child.locked = !child.locked
          } else if (child.children && child.children.length > 0) {
            this.lockNode(row, child.children)
          }
        })
      } else {
        this.taskList.forEach((child) => {
          if (child.id === row[0].data.id) {
            child.locked = !child.locked
          } else if (child.children && child.children.length > 0) {
            this.lockNode(row, child.children)
          }
        })
      }
    },

    handlerExportExpand(type) {
      if (type === 'export-before') {
        this.showList = []
        this.copyShow(this.taskList, this.showList, 'before')
      } else if (type === 'export-after') {
        this.copyShow(this.taskList, this.showList, 'after')
      }
      this.Ref(true)
    },

    copyShow(list, lists, type) {
      if (type === 'before') {
        list.forEach((child) => {
          var item = { id: child.id, isShow: child.isShow }
          // child.isShow = true
          if (child.isexpand === true || child.isexpand === false) {
            item.isexpand = child.isexpand
            if (child.isexpand === false) {
              this.handlerExpand(child.id, true, null)
            }
          }
          if (child.children && child.children.length > 0) {
            item.children = []
            this.copyShow(child.children, item.children, type)
          }
          lists.push(item)
        })
      } else if (type === 'after') {
        list.forEach((child) => {
          var item = null
          lists.filter((k) => {
            if (k.id === child.id) item = k
          })
          if (!item) return
          if (item.isexpand === true || item.isexpand === false) {
            if (child.isexpand != item.isexpand) this.handlerExpand(child.id, item.isexpand, null)
            child.isexpand = item.isexpand
          }
          if (item.children) {
            this.copyShow(child.children, item.children, type)
          }
        })
      }
    },

    //更新数据（依赖线）
    Ref() {
      //更新完成数据后，执行后面这句即可
      this.dependencyRef = true
    },
    //刷新触发（依赖线）
    refOK(result) {
      if (result) {
        this.dependencyRef = false
      }
    },

    localTask(itemId) {
      let result = this.$refs.wrapper.getTask(itemId)
      if (result.self) {
        let left = result.self.left
        let unitWidth = this.currentDaySize.actualValue
        this.$refs.chartDate.scrollLeft = left >= unitWidth ? left - unitWidth : left
      }
    },

    //测试
    testAdd() {
      let task = {
        taskName: '5',
        ower: '',
        type: 'task',
        stoneTime: '',
        percentage: 100,
        isShow: true,
        planBeginTime: 1570163400000, //1569817800000,
        planEndTime: 1570346400000, //1570000800000,
        actualBeginTime: 1570163400000, //1567958400000,
        actualEndTime: 1570346400000, //1568217600000,
        id: 5,
        parentId: 1,
        dependOn: [2],
      }
      this.addNewTask(task, [{ from: 4, to: 5 }], -1, 'add', null)
    },
    testDe() {
      this.addDependency([{ from: 1568028403488, to: 1567028403488 }], 'add')
    },
    testDelete() {
      // this.deleteTask(1568028411761)
      this.deleteTask(4, 'add', null, null)
    },
    testExchange() {
      this.exchangeTask(1568028464174, 1567028403488, 'add')
    },
    changeDisable() {
      if (this.disable) {
        this.disable = false
      } else {
        this.disable = true
      }
    },
    testMoveTo() {
      this.moveToTask(1568028403474, 1568544467666, 0, 'new')
    },
    testChange() {
      let task = JSON.parse(JSON.stringify(this.taskList[1].children[0].children[1]))
      task.percentage = 75
      this.changeTask(task, 'add')
    },
    activeShow() {
      if (this.activeShowValue) {
        this.activeShowValue = false
      } else {
        this.activeShowValue = true
      }
      this.Ref()
    },
    popoverShow() {
      if (this.isPopoverShow) {
        this.isPopoverShow = false
      } else {
        this.isPopoverShow = true
      }
    },
    testExpand() {
      this.handlerExpand(1568028397666, false)
    },
  },
  created() {
    // this.getTaskList()
  },
  mounted() {
    // this.getCurrentBrowser()
    this.getGanttDays()

    this.calculateDateTotalWidth()

    this.$nextTick(() => {
      // this.zoomToFit()
      //this.handlerDateRangOnChange('', this.getInitStartAndEndTime())
    })
  },
  watch: {
    task() {
      this.taskList = JSON.parse(JSON.stringify(this.task))
      this.$nextTick(() => {
        this.$refs.wrapper.refreshData()
      })
      // this.$refs.wrapper.currentTaskList = JSON.parse(JSON.stringify(this.task))
      // this.$refs.wrapper.taskList = JSON.parse(JSON.stringify(this.task))
      // this.$refs.wrapper.handlerCheckList()
      this.undoList = []
      this.redoList = []
      this.isTaskChange = !this.isTaskChange
    },
    isTaskChange() {
      this.allDaysGantt = []
      this.daysGantt = []
      this.allDaysGanttMonAndSun = []
      this.daysGanttMonAndSun = []
      this.getGanttDays()
      this.calculateDateTotalWidth()
      // this.zoomToFit()
    },
    chartDateWidth() {
      if (this.dateTotalWidth < this.chartDateWidth) {
        this.calculateVaueByChartDateWidth()
        this.calculateDateTotalWidth()
        this.$refs.wrapper.handlerCheckList(false)
      }
    },
    isDepend() {
      window.console.log('isDepend:', this.isDepend)
    },
  },
}
</script>
<style lang="less" scoped>
.locationTop {
  position: absolute;
  z-index: 20;
  left: 0px;
  background: white;
}
.locationAll {
  position: absolute;
  z-index: 99;
  left: 20px;
  // border-bottom:1px solid red;
}
.location {
  position: absolute;
  z-index: 100;
  text-align: center;
  height: 100%;
  cursor: pointer;
}
.chart {
  height: 100%;
  position: relative;
}
.chart-date {
  //left: 10px;
  position: absolute; //relative;
  top: 0px;
  //top: 150px;
  overflow-x: scroll; //x方向的自动滑块
  overflow-y: hidden;
  // border: 1px solid #d7d7d7;
  //height: 600px;
  // width: 1200px;
}
.chart-body {
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
}
.chooseLevel {
  position: relative;
  padding: 10px;
  height: 150px;
}
.reundo {
  width: 2em;
  height: 2em;
}
.reundo svg {
  width: 1.5em;
  height: 1.5em;
}
</style>