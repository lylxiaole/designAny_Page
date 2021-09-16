<template>
  <div>
    <!-- <div class="weekendAll" v-if="showNonWeekday">
      <weekend :weekday-b-g-color="weekdayBGColor" :all-days="allDays" :all-days-mon-and-sun="allDaysMonAndSun"
        :year-month-day-hour-combine="yearMonthDayHourCombine" :current-day-size="currentDaySize" :weekends-height="chartAllHeight" />
    </div> -->
    <!-- <div class="workAll" v-if="timeDivDate.day.isShow">
      <div class="work" v-for="(child,index) in workTimeList" :key="index+'work'"
        :style="{top:'0px',width:child.width+'px',height:chartAllHeight+'px',left:child.left+'px',background:workBGColor}" />
    </div>
    <div class="holidayAll" v-if="timeDivDate.holiday.isShow">
      <div class="holiday" v-for="(child,index) in holidayTimeList" :key="index+'holiday'"
        :style="{top:'0px',width:child.width+'px',height:chartAllHeight+'px',left:child.left+'px',background:timeDivDate.holiday.color}" />
    </div>
    <div class="userSetAll" v-if="timeDivDate.userSet.isShow">
      <div class="userSet" v-for="(child,index) in userSetList" :key="index+'userSet'"
        :style="{top:'0px',width:child.width+'px',height:chartAllHeight+'px',left:child.left+'px',background:child.color}" />
    </div> -->
    <!-- 'border-bottom':'2px solid '+splitLineColor,'border-top':'2px solid '+splitLineColor,
      'margin-top':(item.type=='task'?'2px':'0px'),-->
    <div class="gridForm" v-for="(item, all_index) in this.lineList" :ref="item.id" :key="item.id+'_gridForm'" :style="{top:(item.gridForm.top)+'px',width:item.gridForm.width+'px',height:item.type=='task'?(item.gridForm.height-4+'px'):(item.gridForm.height+'px'),left:'0px',
      'border-top':item.type=='task'?'1px solid'+splitLineColor:'0px solid','border-bottom':item.type=='task'||item.type=='project'?'1px solid '+splitLineColor:'0px solid',
      'margin-top':(item.type=='task'?'2px':'0px'),'margin-bottom':(item.type=='task'?'2px':'0px'),
      background:item.gridForm.backgroundColor}" @mouseover="handleMouseover(item)" @mouseout="handleMouseout(item)" @click="handleClick(item)">

      <div class="workAll" v-if="timeDivDate.day.isShow && currentDaySize.level <= 8">
        <div class="work" :ref="item.id+'_work'" v-for="(child,index) in workTimeList[all_index]" :key="index+'work'"
          :style="{top:'0px',width:child.width+'px',height:(item.gridForm.height-6)+'px',left:child.left+'px',background:workBGColor,'margin-bottom':'1px'}" />
      </div>
      <div class="restAll" v-if="timeDivDate.day.restShow && currentDaySize.level <= 8">
        <div class="work" :ref="item.id+'_rest'" v-for="(child,index) in restTimeList[all_index]" :key="index+'work'"
          :style="{top:'0px',width:child.width+'px',height:(item.gridForm.height-6)+'px',left:child.left+'px',background:restBGColor,'margin-bottom':'1px'}" />
      </div>
      <div class="weekendAll" v-if="showNonWeekday && item.type=='task'">
        <weekend ref="weekend" :weekday-b-g-color="weekdayBGColor" :all-days="allDays" :all-days-mon-and-sun="allDaysMonAndSun"
          :year-month-day-hour-combine="yearMonthDayHourCombine" :current-day-size="currentDaySize" :weekends-height="item.gridForm.height-6"
          :task="item" />
      </div>
      <div class="holidayAll" v-if="timeDivDate.holiday.isShow && item.type=='task'">
        <div class="holiday" :ref="item.id+'_holiday'" v-for="(child,index) in holidayTimeList" :key="index+'holiday'"
          :style="{top:'0px',width:child.width+'px',height:(item.gridForm.height-6)+'px',left:child.left+'px',background:timeDivDate.holiday.color,'margin-bottom':'1px'}" />
      </div>
      <div class="userSetAll" v-if="timeDivDate.userSet.isShow && currentDaySize.level <= 8">
        <div class="userSet" :ref="item.id+'_userSet_'+child.flag" v-for="(child,index) in userSetList[all_index]" :key="index+'userSet'"
          :style="{top:'0px',width:child.width+'px',height:(rowHeight-6)+'px',left:child.left+'px',background:child.color,'margin-bottom':'1px'}" />
      </div>
      <div class="verticalLineAll" v-if="currentDaySize.level!=13 && item.type=='task'">
        <div class="verticalLine" v-for="count in verticalLineAllNo13" :key="count+'verticalLine'"
          :style="{width:'1px',height:(item.gridForm.height-6)+'px',left:(count-1)*currentDaySize.actualValue+'px','border-right':'1px solid '+verticalSplitLineColor}" />
      </div>
      <div class="verticalLineAll" v-if="currentDaySize.level==13 && item.type=='task'">
        <div class="verticalLine" v-for="count in dateTotalWidth/(currentDaySize.actualValue/4)" :key="count+'verticalLine'"
          :style="{width:'1px',height:(item.gridForm.height-6)+'px',left:(count-1)*(currentDaySize.actualValue/4)+'px','border-right':'1px solid '+verticalSplitLineColor}" />
      </div>
    </div>
    <!-- <div
      class="gridForm"
      v-for="item in this.lineList"
      :key="item.id+'_gridForm'"
      :style="{top:(item.gridForm.top)+'px',width:item.gridForm.width+'px',height:item.gridForm.height+'px',left:'0px','border-bottom':'1px solid '+splitLineColor,background:item.gridForm.backgroundColor}"

    /> -->

  </div>
</template>

<script>
import weekend from './weekend.vue'
import moment from 'moment'
export default {
  // name: 'gridLine',
  components: {
    weekend: weekend,
  },
  props: [
    'taskList',
    'currentDaySize',
    'dateTotalWidth',
    'ganttStartDate',
    'ganttEndDate',
    'chartAllHeight',
    'timeDivDate',
    'rowHeight',
    'workBGColor',
    //'dateBorderColor',
    'splitLineColor', //分割线的颜色
    'verticalSplitLineColor', //纵向分割线颜色
    'oddTaskBackgroundColor', //奇数任务行颜色
    'evenTaskBackgroundColor', //偶数任务行颜色
    'projectBackgroundColor', //project任务行颜色
    'middleBackgroundColor', //middle任务行颜色
    'taskClickColor', //任务行鼠标选中颜色
    'taskHoverColor', //任务行鼠标悬停颜色

    'weekdayBGColor', //周六周日的背景颜色
    'holidayBGColor', //节假日的背景色
    'allDays',
    'allDaysMonAndSun',
    'yearMonthDayHourCombine',
    'showNonWeekday',

    'ganttCalendar', //工厂日历
    'calendarLevel', //工厂日历级别
    'speWorkColor',
    'speRestColor',
    'workTimeType',
    'restBGColor',
  ],
  data() {
    return {
      moment,
      formWidth: this.currentDaySize.value,

      //////////
      gridFormBackgroundColor: '', //表格行的背景颜色
      hasClick: false, //是否有选中行
      clickRow: {}, //选中行的信息
      hoverRowBGColor: '', //悬浮行的颜色
      hoverRowID: '', //悬浮行的id
      grindLineS:false,
    }
  },
  watch: {},
  computed: {
    verticalLineAllNo13(){
      return Math.round(this.dateTotalWidth/this.currentDaySize.actualValue);
    },
    lineList() {
      let lines = []
      //获取头的高度
      let headHeight = 0
      // headHeight += this.$parent.$refs.choose.offsetHeight
      //获取每行的高度
      let lineHeight = this.rowHeight
      //获取每格的宽度
      let gridWidth = this.formWidth
      let index = 0

      // let arr = []
      // this.computedListOne(this.taskList, arr)
      if (this.computedList.length > 0) {
        lines = this.computedList
          .map((task) => {
            if (task.isShow) {
              let form = {}
              // form.top = headHeight + lineHeight * index
              form.top = task.top
              form.height = lineHeight
              form.width = this.dateTotalWidth
              if (task.type == 'task') {
                if (index % 2 == 0) {
                  //index从0开始
                  form.backgroundColor = this.oddTaskBackgroundColor
                } else {
                  form.backgroundColor = this.evenTaskBackgroundColor
                }
                task.gridForm = form
                index++
              } else if (task.type == 'project') {
                form.backgroundColor = this.projectBackgroundColor
              } else if (task.type == 'middle') {
                form.backgroundColor = this.middleBackgroundColor
              }
              task.gridForm = form
            } else {
              task.gridForm = null
            }
            return task
          })
          .filter((task) => task.gridForm !== null)
        return lines
      } else {
        return lines
      }
    },
    formLeft(index) {
      return this.formWidth * index
    },
    computedList() {
      let arr = []
      this.computedListOne(this.taskList, arr)
      return arr
    },
    currentStartTime() {
      let startTime
      let firstDay = false
      let firstYear = false
      switch (this.currentDaySize.level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          startTime = this.ganttStartDate
          break
        case 9:
          startTime = this.$parent.getMonDay(this.ganttStartDate)
          break
        case 10:
          // firstDay = true
          startTime = this.ganttStartDate
          break
        case 11:
          startTime = this.$parent.getMonDay(this.ganttStartDate)
          break
        case 12:
          firstDay = true
          startTime = this.ganttStartDate
          break
        case 13:
          firstDay = true
          firstYear = true
          startTime = this.ganttStartDate
          break
        default:
          break
      }
      let timeList = startTime.split('-')
      let year = parseInt(timeList[0])
      let month = parseInt(timeList[1])
      let day = parseInt(timeList[2])
      if (firstDay) {
        day = 1
      }
      if (firstYear) {
        day = 1
        month = 1
      }
      let time = new Date(year, month - 1, day)
      return time
    },
    currentEndTime() {
      let endTime
      let lastDay = false
      let lastYear = false
      switch (this.currentDaySize.level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          endTime = this.ganttEndDate
          break
        case 9:
          endTime = this.$parent.getSunDay(this.ganttEndDate)
          break
        case 10:
          endTime = this.ganttEndDate
          break
        case 11:
          endTime = this.$parent.getSunDay(this.ganttEndDate)
          break
        case 12:
          lastDay = true
          endTime = this.ganttEndDate
          break
        case 13:
          lastYear = true
          endTime = this.ganttEndDate
          break
        default:
          break
      }
      let timeList = endTime.split('-')
      let year = parseInt(timeList[0])
      let month = parseInt(timeList[1])
      let day = parseInt(timeList[2])
      let time = new Date(year, month - 1, day)
      if (lastDay) {
        time = new Date(year, month, 0)
      }
      if (lastYear) {
        time = new Date(year + 1, 0, 0)
      }
      time.getDate
      return time
    },
    workTimeList() {
      this.grindLineS
      //#f1f1f1
      if (this.currentDaySize.level > 8) {
        return
      }
      var lists = []
      this.workTimeOne(this.taskList, lists)
      return lists
    },
    ganttRest() {
      let result = {}
      for (let [key, value] of Object.entries(this.ganttCalendar)) {
        let item = this.ganttRestOne(value)
        result[key] = item
      }
      return result
    },
    restTimeList() {
      this.grindLineS
      //#f1f1f1
      if (this.currentDaySize.level > 8) {
        return
      }
      var lists = []
      this.restTimeOne(this.taskList, lists)
      return lists
    },
    holidayTimeList() {
      this.grindLineS
      if (this.currentDaySize.level > 11) return
      let lists = []
      this.timeDivDate.holiday.list.forEach((k) => {
        let time = k.split('-')
        for (let i = 0; i < time.length; i++) {
          time[i] = parseInt(time[i])
        }
        let item = {}
        item.left = this.computedTimeWidth(new Date(time[0], time[1] - 1, time[2]))
        item.width = this.computedTimeWidth(new Date(time[0], time[1] - 1, time[2]), new Date(time[0], time[1] - 1, time[2] + 1))
        lists.push(item)
      })
      return lists
    },
    userSetList() {
      this.grindLineS
      if (this.currentDaySize.level > 8) return
      let lists = []
      this.userSetListOne(this.taskList, [], lists)
      return lists
    },
    workTimeCom() {
      //window.console.log('workTimeCom')
      //window.console.log(this.workTimeType)
      if (this.workTimeType === '周循环') {
        return 1
      } else if (this.workTimeType === '详细时间') {
        return 2
      } else {
        return 0
      }
    },
  },
  methods: {
    handleColorDueToDateChange() {
      if (this.hasClick) {
        let weekendArrar = this.$refs.weekend
        if (weekendArrar != undefined && weekendArrar.length > 0) {
          weekendArrar.forEach((element) => {
            this.changeBgColor(element, this.clickRow.id, '_weekend', this.taskClickColor)
          })
        }
        this.changeBgColor(this, this.clickRow.id, '_work', this.taskClickColor) //改变非工作时间背景色 _rest
        this.changeBgColor(this, this.clickRow.id, '_holiday', this.taskClickColor) //改变节假日背景色
        this.changeBgColor(this, this.clickRow.id, '_rest', this.taskClickColor) //改变节假日背景色
        if (this.userSetList != undefined && this.userSetList.length > 0) {
          this.userSetList.forEach((element) => {
            if (element != undefined && element.length > 0) {
              element.forEach((el) => {
                this.changeBgColor(this, this.clickRow.id, '_userSet_' + el.flag, this.taskClickColor)
              })
            }
          })
        }
      }
    },
    reColorDueToDateChange() {
      //还原点击行颜色（所有）
      if (this.hasClick) {
        this.$refs[this.clickRow.id][0].style.background = this.clickRow.backgroundColor
      

        let weekendArrar = this.$refs.weekend
        if (weekendArrar != undefined && weekendArrar.length > 0) {
          weekendArrar.forEach((element) => {
            this.changeBgColor(element, this.clickRow.id, '_weekend', this.weekdayBGColor)
          })
        }
        this.changeBgColor(this, this.clickRow.id, '_work', this.workBGColor) //改变工作时间背景色
        this.changeBgColor(this, this.clickRow.id, '_holiday', this.holidayBGColor) //改变节假日背景色
        this.changeBgColor(this, this.clickRow.id, '_rest', this.restBGColor) //改变休息时间背景色
        if (this.userSetList != undefined && this.userSetList.length > 0) {
          this.userSetList.forEach((element) => {
            if (element != undefined && element.length > 0) {
              element.forEach((el) => {
                this.changeBgColor(this, this.clickRow.id, '_userSet_' + el.flag, el.color)
              })
            }
          })
        }

        this.hasClick = false
        this.clickRow = {}
      }
    },
    handleClick(item) {
      this.$emit('leftTableClickRow', item)
      let weekendArrar = this.$refs.weekend

      if (item.id == this.hoverRowID) {
        this.clickRow.recordBG = this.hoverRowBGColor
      } else {
        if (item.gridForm == null || item.gridForm == undefined) {
          this.clickRow.recordBG = this.$refs[item.id][0].style.background //记录点击行点击之前的背景颜色
        } else {
          this.clickRow.recordBG = item.gridForm.backgroundColor
        }
      }

      if (this.hasClick) {
        //如果有选中行，则把选中行的颜色恢复到之前未选中的颜色
        if (this.$refs[this.clickRow.id][0] != undefined) {
          this.$refs[this.clickRow.id][0].style.background = this.clickRow.backgroundColor //恢复任务行背景色
          //恢复周六周日背景色
          if (weekendArrar != undefined && weekendArrar.length > 0) {
            weekendArrar.forEach((element) => {
              this.changeBgColor(element, this.clickRow.id, '_weekend', this.weekdayBGColor)
            })
          }
          this.changeBgColor(this, this.clickRow.id, '_work', this.workBGColor) //恢复非工作时间背景色
          this.changeBgColor(this, this.clickRow.id, '_holiday', this.holidayBGColor) //恢复节假日背景颜色
          this.changeBgColor(this, this.clickRow.id, '_rest', this.restBGColor) //恢复休息时间背景色
          //恢复特殊日历背景颜色
          if (this.userSetList != undefined && this.userSetList.length > 0) {
            this.userSetList.forEach((element) => {
              if (element != undefined && element.length > 0) {
                element.forEach((el) => {
                  this.changeBgColor(this, this.clickRow.id, '_userSet_' + el.flag, el.color)
                })
              }
            })
          }
        }
      }

      //改变任务行背景色
      this.$refs[item.id][0].style.background = this.taskClickColor
      //改变周六周日背景色
      if (weekendArrar != undefined && weekendArrar.length > 0) {
        weekendArrar.forEach((element) => {
          this.changeBgColor(element, item.id, '_weekend', this.taskClickColor)
        })
      }
      this.changeBgColor(this, item.id, '_work', this.taskClickColor) //改变非工作时间背景色
      this.changeBgColor(this, item.id, '_holiday', this.taskClickColor) //改变节假日背景色
      this.changeBgColor(this, item.id, '_rest', this.taskClickColor) //改变休息时间背景色
      //改变特殊日历背景颜色
      if (this.userSetList != undefined && this.userSetList.length > 0) {
        this.userSetList.forEach((element) => {
          if (element != undefined && element.length > 0) {
            element.forEach((el) => {
              this.changeBgColor(this, item.id, '_userSet_' + el.flag, this.taskClickColor)
            })
          }
        })
      }

      this.hasClick = true
      this.clickRow.id = item.id
      this.clickRow.backgroundColor = this.clickRow.recordBG
      this.clickRow.isShow = item.isShow
    },
    handleMouseout(item) {
      this.$emit('leftTableLeaveRow', item)
      if (item.id != this.clickRow.id) {
        if (item.gridForm == null || item.gridForm == undefined) {
          if (this.hoverRowBGColor != undefined && this.hoverRowBGColor != '') {
            this.$refs[item.id][0].style.background = this.hoverRowBGColor
          }
        } else {
          this.$refs[item.id][0].style.background = item.gridForm.backgroundColor
        }
        //恢复周六周日的背景色
        if (this.$refs.weekend != undefined && this.$refs.weekend.length > 0) {
          this.$refs.weekend.forEach((element) => {
            this.changeBgColor(element, item.id, '_weekend', this.weekdayBGColor)
          })
        }
        this.changeBgColor(this, item.id, '_work', this.workBGColor) //恢复非工作时间的背景色
        this.changeBgColor(this, item.id, '_holiday', this.holidayBGColor) //恢复节假日时间的背景色
        this.changeBgColor(this, item.id, '_rest', this.restBGColor) //恢复休息时间背景色
        //恢复特殊日历背景颜色
        if (this.userSetList != undefined && this.userSetList.length > 0) {
          this.userSetList.forEach((element) => {
            if (element != undefined && element.length > 0) {
              element.forEach((el) => {
                this.changeBgColor(this, item.id, '_userSet_' + el.flag, el.color)
              })
            }
          })
        }
      }
    },
    handleMouseover(item) {
      this.$emit('leftTableHoverRow', item)
      if (item.id != this.hoverRowID) {
        this.hoverRowID = item.id
        this.hoverRowBGColor = this.$refs[item.id][0].style.background
      }
      if (item.id != this.clickRow.id) {
        this.hoverRowBGColor = this.$refs[item.id][0].style.background
        this.$refs[item.id][0].style.background = this.taskHoverColor
        //修改周六周日的背景色
        if (item.type == 'task') {
          if (this.$refs.weekend != undefined && this.$refs.weekend.length > 0) {
            this.$refs.weekend.forEach((element) => {
              this.changeBgColor(element, item.id, '_weekend', this.taskHoverColor)
            })
          }
        }
        this.changeBgColor(this, item.id, '_work', this.taskHoverColor) //修改非工作时间的背景色
        this.changeBgColor(this, item.id, '_holiday', this.taskHoverColor) //修改节假日工作时间的背景色
        this.changeBgColor(this, item.id, '_rest', this.taskHoverColor) //改变休息时间背景色
        //修改特殊日历的背景颜色
        if (this.userSetList != undefined && this.userSetList.length > 0) {
          this.userSetList.forEach((element) => {
            if (element != undefined && element.length > 0) {
              element.forEach((el) => {
                this.changeBgColor(this, item.id, '_userSet_' + el.flag, this.taskHoverColor)
              })
            }
          })
        }
      }
    },
    //修改背景颜色
    changeBgColor(_this, itemId, refName, color) {
      let arrar = _this.$refs[itemId + refName]
      if (arrar != undefined && arrar.length > 0) {
        arrar.forEach((element) => {
          element.style.backgroundColor = color
        })
      }
    },
    // 根据时间计算距离
    computedTimeWidth(startTime, endTime) {
      //开始时间减去整个甘特图的开始时间
      let time = this.currentStartTime
      //如果有结束时间测返回宽度，没有结束时间则返回开始的位置
      if (!endTime) {
        return ((startTime - time.getTime()) / this.currentDaySize.time) * this.currentDaySize.actualValue
      } else {
        return ((endTime - startTime) / this.currentDaySize.time) * this.currentDaySize.actualValue
      }
    },
    turntoNum(list) {
      if (!list || list.length < 1) return
      for (let i = 0; i < list.length; i++) {
        list[i] = parseInt(list[i])
      }
      return list
    },
    computedListOne(item, list) {
      item.forEach((child) => {
        list.push(child)
        if (child.children && child.children.length > 0) {
          this.computedListOne(child.children, list)
        }
      })
    },
    workTimeOne(list, lists) {
      list.forEach((child) => {
        lists.push([])
        if (child.type === this.calendarLevel) {
          if (this.workTimeCom === 1) {
            this.ganttCalendar.forEach((k) => {
              if (k.id === child.id) {
                let list = this.workTimeListHandle(k.times)
                if (child.isexpand === true && child.children && child.children.length > 0) {
                  this.workTimeSet(child.children, list, lists)
                }
              }
            })
          } else if (this.workTimeCom === 2) {
            let key = '' + child.id
            if (this.ganttCalendar[key]) {
              let list = this.workTimeListHandleSimple(this.ganttCalendar[key])
              if (child.isexpand === true && child.children && child.children.length > 0) {
                this.workTimeSet(child.children, list, lists)
              }
            }
          }
        } else if (child.isexpand === true && child.children && child.children.length > 0) {
          this.workTimeOne(child.children, lists)
        }
      })
    },
    ganttRestOne(value) {
      let result = []
      let preChild = null
      let sortValue = this.sortByStart(value)
      sortValue.forEach((child, index) => {
        let flag = true
        if (index === 0) {
          flag = false
          let item = {}
          item.start = this.currentStartTime.getTime()
          item.end = child.start
          preChild = child
          result.push(item)
        } else {
          let item = {}
          item.start = preChild.end
          item.end = child.start
          preChild = child
          result.push(item)
        }
        if (index === sortValue.length - 1) {
          flag = false
          let item = {}
          item.start = child.end
          item.end = this.currentEndTime.getTime() + 24 * 60 * 60 * 1000
          result.push(item)
        }
      })
      return result
    },
    sortByStart(value) {
      let result = []
      value.forEach((child, index) => {
        if (index === 0) {
          result.push(child)
        } else {
          let j = result.length
          for (var i = 0; i < j; i++) {
            if (child.start < result[i].start) {
              j = i
              break
            }
          }
          result.splice(j, 0, child)
        }
      })
      return result
    },
    restTimeOne(list, lists) {
      list.forEach((child) => {
        lists.push([])
        if (child.type === this.calendarLevel) {
          if (this.workTimeCom === 1) {
            // this.ganttRest.forEach((k) => {
            //   if (k.id === child.id) {
            //     let list = this.workTimeListHandle(k.times)
            //     if (child.isexpand === true && child.children && child.children.length > 0) {
            //       this.workTimeSet(child.children, list, lists)
            //     }
            //   }
            // })
          } else if (this.workTimeCom === 2) {
            let key = '' + child.id
            if (this.ganttRest[key]) {
              let list = this.workTimeListHandleSimple(this.ganttRest[key])
              if (child.isexpand === true && child.children && child.children.length > 0) {
                this.workTimeSet(child.children, list, lists)
              }
            }
          }
        } else if (child.isexpand === true && child.children && child.children.length > 0) {
          this.restTimeOne(child.children, lists)
        }
      })
    },
    workTimeSet(children, list, lists) {
      children.forEach((child) => {
        if (child.type === 'task') {
          lists.push(list)
        } else {
          lists.push([])
        }
        if (child.isexpand === true && child.children && child.children.length > 0) {
          this.workTimeSet(child.children, list, lists)
        }
      })
    },
    workTimeListHandle(times) {
      //#f1f1f1
      if (this.currentDaySize.level > 8) {
        return
      }
      let list = []
      let timeList = this.workTimeWeek(times)
      let currentTime = new Date(this.currentStartTime.getFullYear(), this.currentStartTime.getMonth(), this.currentStartTime.getDate(), 0, 0, 0)
      let time = moment(currentTime.getTime())
      let startTime = moment(currentTime.getTime())
      let endTime = moment(currentTime.getTime())
      while (time.valueOf() <= this.currentEndTime.getTime()) {
        let index = time.isoWeekday()
        endTime.hours(timeList[index - 1].shour)
        endTime.minutes(timeList[index - 1].sminute)
        list.push({ start: startTime.valueOf(), end: endTime.valueOf() })
        startTime.hours(timeList[index - 1].ehour)
        startTime.minutes(timeList[index - 1].eminute)
        if (startTime.days() < endTime.days() && timeList[index - 1].ehour < 24) {
          startTime.add(1, 'days')
        }
        endTime.hours(0)
        endTime.minutes(0)
        endTime.add(1, 'days')
        time.add(1, 'days')
      }
      let lists = []
      list.forEach((k, index) => {
        if (k.start < k.end) {
          let item = {}
          item.left = this.computedTimeWidth(k.start)
          item.width = this.computedTimeWidth(k.start, k.end)
          lists.push(item)
        }
      })
      return lists
    },
    workTimeListHandleSimple(times) {
      //#f1f1f1
      if (this.currentDaySize.level > 8) {
        return
      }
      let lists = []
      times.forEach((k, index) => {
        if (k.start < k.end) {
          let item = {}
          item.left = this.computedTimeWidth(k.start)
          item.width = this.computedTimeWidth(k.start, k.end)
          lists.push(item)
        }
      })
      return lists
    },
    workTimeWeek(list) {
      var lists = []
      for (var i = 1; i <= 7; i++) {
        var item = { week: i, shour: 0, sminute: 0, ehour: 24, eminute: 0 }
        lists.push(item)
      }
      list.forEach((child) => {
        var stime = moment(child.startTime)
        var etime = moment(child.endTime)
        child.weeks.forEach((k) => {
          lists[k - 1].shour = stime.hours()
          lists[k - 1].sminute = stime.minutes()
          lists[k - 1].ehour = etime.hours()
          lists[k - 1].eminute = etime.minutes()
        })
      })
      return lists
    },
    userSetListOne(children, list, lists) {
      children.forEach((child) => {
        if (child.type === 'task') {
          lists.push(list)
        } else {
          lists.push([])
          var getList = this.timeDivDate.userSet.list.filter((task) => task.id === child.id)
          if (getList.length > 0) {
            var thisList = this.userSetListHandle(getList[0].timeList, getList[0].id)
            if (child.isexpand === true && child.children && child.children.length > 0) {
              this.userSetListOne(child.children, thisList, lists)
            }
          } else if (child.isexpand === true && child.children && child.children.length > 0) {
            this.userSetListOne(child.children, list, lists)
          }
        }
      })
    },
    userSetListHandle(list, id) {
      let lists = []
      list.forEach((k, index) => {
        let item = {}
        // let startDate = this.turntoNum(k.start.split(' ')[0].split('-'))
        // let startTime = this.turntoNum(k.start.split(' ')[1].split(':'))
        // let endDate = this.turntoNum(k.end.split(' ')[0].split('-'))
        // let endTime = this.turntoNum(k.end.split(' ')[1].split(':'))
        item.left = this.computedTimeWidth(k.start_time)
        item.width = this.computedTimeWidth(k.start_time, k.end_time)
        if (k.spec_cal_status === 0) {
          item.color = this.speRestColor
        } else if (k.spec_cal_status === 1) {
          item.color = this.speWorkColor
        }
        item.flag = id + '_' + index
        lists.push(item)
      })
      return lists
    },
  },
}
</script>

<style scoped>
.gridForm {
  position: absolute;
  z-index: 0;
  /* border-bottom: 1px solid #dddddd; */
  /* cursor: pointer; */
}
.work {
  position: absolute;
  z-index: 1;
}
.holiday {
  position: absolute;
  z-index: 1;
}
.userSet {
  position: absolute;
  z-index: 1;
}
.lineInAll {
  position: absolute;
  z-index: 1;
}
.weekendAll {
  position: absolute;
  z-index: 1;
}
.verticalLine {
  position: absolute;
  z-index: 1;
}
</style>