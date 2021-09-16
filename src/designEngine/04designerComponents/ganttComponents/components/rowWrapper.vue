<template>
  <div>
    <div class="row" v-for="(item, index) in this.computedList" :key="item.id+'_'+index">
      <div clss="line_row" v-if="item!=null" :key="item.id + index + 'ccc0'"
        :style="{top: item.top+'px', width:'100%',height:'100%',left: 2 + 'px' }">
        <div class="line" :style="{ left: item.left + 'px', width: item.widthMe + 'px',top: (item.top+firstTop)+'px',}"
          v-show="item.type == 'task' && item.isShow" :ref="'line' + item.id" :key="item.id + index + 'ccc' " @mousedown="
            lineMousedown(`line${item.id}`,$event,item.id,item.parentId,index)
          " @mouseover="lineMouseover(`line${item.id}`,$event,item.id,item.parentId,index)
          " @mouseleave="lineMouseleaveAndDrag(`line${item.id}`)"
          @mouseenter="lineMouseenterAndDrag(`line${item.id}`,$event,item.id,item.parentId,index)" @dblclick="dblclickRowWrapper(item)"
          @click="clickRowWrapper(item)" @contextmenu.prevent="rightClickRowWrapper(item,$event)">
          <slider :min="0" :max="100" :ref="'slider'+item.id" v-model="item.percentage" :id="item.id" :parent-id="item.parentId"
            :widths="item.widthChild" @thunkMousedown="thunkMousedown" @thunkMouseup="thunkMouseup" @thunkMousemove="thunkMousemove"
            v-show="item.type == 'task'" @dblclick="dblclickRowWrapper(item)" @click="clickRowWrapper(item)"
            @contextmenu.prevent="rightClickRowWrapper(item,$event)" :disable="disable" :row-in-height="rowInHeight" :row-height="rowHeight"
            :color-list="colorList" />
          <!-- <div class="leftCurDrag" v-show="item.type == 'task'" :style="{height:rowInHeight+'px !important'}"
            @mousedown.stop="leftCurDragMounsedown(`line${item.id}`,$event,item.id,item.parentId,index)" />
          <div class="rightCurDrag" v-show="item.type == 'task'" :style="{height:rowInHeight+'px !important'}"
            @mousedown.stop="rightCurDragMounsedown(`line${item.id}`,$event,item.id,item.parentId,index)" /> -->
          <!-- <div class="stoneLine" :style="{ top: -8 + 52 - item.top + 'px' }" v-if="item.type == '2'" @mouseenter="stoneLineMouseenter">
          </div> -->
          <!-- <div class="milestone" v-if="item.type == '2'" :style="{top:'0px'}">
            <a-icon type="check" />
          </div> -->
        </div>
        <div class="lineTwo" :key="item.id + index + 'ccc2'"
          v-if="((item.type=='middle'&&item.children&&item.children.length>0&&summaryAble)||item.type=='task'||(item.type=='project'&&item.children&&item.children.length>0&&summaryAble))&&activeShowValue&&item.isShow"
          :style="{left:item.actualLeft+'px',width:item.actualWidthMe+'px',top:(item.top+lineTwoTop)+'px' ,height:rowInHeight+'px' ,background:colorList.lineTwoColor}"
          @mouseenter="lineMouseenter(`line${item.id}`,$event,item.id,item.parentId,index,'lineTwo')" @mouseleave="lineMouseleave" />
      </div>
      <div class="group" :style="{top: (item.top+firstTop) + 'px',
                 left: item.left + 'px',
                 width: item.widthMe + 'px',
                 height:(rowInHeight+1)+'px !important',
                 'line-height':(rowInHeight+1)+'px !important',
                 background:colorList.middleColor+' !important',
        }" v-if="(item.type == 'middle') && item.isShow&&item.children&&item.children.length>0&&summaryAble" :key="item.id + 'zzzzz'"
        :ref="'group'+item.id" @mouseenter="lineMouseenter(`group${item.id}`,$event,item.id,item.parentId,index)" @mouseleave="lineMouseleave"
        @dblclick="dblclickRowWrapper(item)" @click="clickRowWrapper(item)" @contextmenu.prevent="rightClickRowWrapper(item,$event)">
        <div class="progress" :style="{ width: item.percentage + '%' ,background:colorList.middlePerColor+' !important'}" />
      </div>
      <div class="project" :style="{top: (item.top+firstTop) + 'px',
                 left: item.left + 'px',
                 width: item.widthMe + 'px',
                 height:(rowInHeight+1)+'px !important',
                 'line-height':(rowInHeight+1)+'px !important',
                 background:colorList.projectColor+' !important',
        }" v-if="item.type == 'project' && item.isShow && isProject&&item.children&&item.children.length>0&&summaryAble" :key="item.id + 'zzzzz'"
        :ref="'project'+item.id" @mouseenter="lineMouseenter(`project${item.id}`,$event,item.id,item.parentId,index)" @mouseleave="lineMouseleave"
        @dblclick="dblclickRowWrapper(item)" @click="clickRowWrapper(item)" @contextmenu.prevent="rightClickRowWrapper(item,$event)">
        <div class="progress" :style="{ width: item.percentage + '%' ,background:colorList.projectPerColor+' !important'}" />
      </div>
    </div>
    <!-- <VueContextMenu id="context-menu" style="position: absolute;" ref="ctxMenu">
      <li class="themeHover" v-for="menu in rightMenus" :key="menu" @click="onRightMenuChoose(menu)">&nbsp;&nbsp;{{menu}}</li>
    </VueContextMenu> -->
  </div>
</template>

<script>
import slider from './slider.vue'
import moment from 'moment'
import XEUtils from 'xe-utils'
// var VueContextMenu = require('vue-context-menu')

export default {
  components: {
    slider: slider,
    // VueContextMenu: VueContextMenu,
  },
  props: [
    'activeShowValue',
    'currentDaySize',
    'taskList',
    'isShowMsg',
    'currentProjectMsg',
    'dateTotalWidth',
    'redoList',
    'undoList',
    'disable',
    'ganttStartDate',
    'rowHeight',
    'colorList',
    'dateHeaderHeight',
    'drapDepen', //是否拖拽联动
    'rowHeightModel', //是否自动设置任务条高度
    'setFirstTop', //预计任务条和顶部的高度
    'setRowInHeightT', //展示实际任务条时预计任务条的高度
    'setRowInHeightS', //不展示实际任务条时预计任务条的高度
    'setLineTwoTop', //预计任务条和实际任务条的距离

    'isUseDefaultPopup', //是否使用默认弹窗（当鼠标悬浮在任务条上时）
    'popForm',
    'summaryAble', //是否展示汇总信息
    'ganttMove',
    'filter',
  ],
  data() {
    return {
      moment,
      isShowPop: false,
      currentProjectMsgPop: {
        taskName: '',
        allTime: 0,
        percentage: 0,
        planBeginTime: 0,
        planEndTime: 0,
        left: 0,
        top: 0,
        dateList: [],
      },
      currentTaskList: [],
      redoLists: [],
      undoLists: [],
      actual: false,
      depenList: [],
      parList: [],
      indexList: [],
      lineList: [],
      resultList: [],
      checkDepError: null,
      nowHeight: 0,
      isProject: true,
      // rightMenus: ['锁定产线'],
      popWidth: 0,//气泡卡片宽度
    }
  },
  computed: {
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
    rowInHeight() {
      if (this.rowHeightModel) {
        if (this.activeShowValue) {
          return this.rowHeight * 0.3
        } else {
          return this.rowHeight * 0.6
        }
      } else {
        if (this.activeShowValue) {
          return this.setRowInHeightT
        } else {
          return this.setRowInHeightS
        }
      }
    },
    lineTwoTop() {
      if (this.rowHeightModel) {
        return this.rowHeight * 0.6
      } else {
        return this.setLineTwoTop
      }
    },
    firstTop() {
      if (this.rowHeightModel) {
        return this.rowHeight / 5
      } else {
        return this.setFirstTop
      }
    },
  },
  methods: {
    getDepenList(id) {
      this.computedList.forEach((child, a) => {
        if (child.dependOn && child.dependOn.length > 0) {
          for (let i = 0; i < child.dependOn.length; i++) {
            if (child.dependOn[i] == id) {
              if (this.depenList.includes(child.id) == false) {
                this.depenList.push(child.id) //依赖于当前任务 的 任务 id
                this.indexList.push(a) //依赖于当前任务 的 任务 索引
                this.parList.push(child.parentId) //依赖于当前任务 的 任务 父级id
                this.lineList.push(this.$refs['line' + child.id][0]) //依赖于当前任务 的 任务 所在的div
                this.resultList.push(this.computedList[a].left) //依赖于当前任务 的 任务 所在的div的left
                this.getDepenList(child.id)
                break
              }
            }
          }
        }
      })
    },
    //每一行拖拽
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    lineMousedown(dom, e, id, parentId, index) {
      if (this.disable == false || this.ganttMove == false) return
      e.stopPropagation()
      let line = this.$refs[dom][0]
      let cp = e.pageX
      let result
      let z = 0
      let left
      let undoItem = {}
      undoItem.type = 0
      undoItem.id = [id]
      undoItem.dom = [dom]
      undoItem.old = []
      undoItem.new = []
      undoItem.index = [index]
      undoItem.parin = []
      undoItem.grain = []
      undoItem.ins = []
      let checkResult
      let checkDep = true
      this.depenList = []
      this.parList = []
      this.indexList = []
      this.lineList = []
      this.resultList = []
      if (this.drapDepen) {
        this.getDepenList(id)
      }
      document.onmousemove = (event) => {
        if (
          parseInt(line.style.left) + parseInt(line.style.width) - this.$parent.$refs.chartDate.scrollLeft >=
          this.$parent.chartDateWidth - this.currentDaySize.actualValue
        ) {
          z = this.$parent.$refs.chartDate.scrollLeft + this.currentDaySize.actualValue
          let sctoTop = this.$parent.$refs.chartBody.scrollTop
          this.$parent.$refs.chartDate.scrollLeft = z // this.$parent.$refs.chartDate.scrollTo(z, 0)
          this.$parent.$refs.chartBody.scrollTop = sctoTop // this.$parent.$refs.chartBody.scrollTo(0, sctoTop)
          this.$parent.$refs.shade.scrollTop = sctoTop // this.$parent.$refs.shade.scrollTo(0, sctoTop)
          let newWith = event.pageX - cp
          result = this.computedList[index].left + newWith
          line.style.left = result + 'px'
          if (this.drapDepen) {
            this.depenList.forEach((k, a) => {
              this.lineList[a].style.left = this.computedList[this.indexList[a]].left + newWith + 'px'
              this.resultList[a] = this.computedList[this.indexList[a]].left + newWith
            })
          }
          if (result <= 0) result = 0
        } else if (event.clientX <= this.currentDaySize.actualValue) {
          z = this.$parent.$refs.chartDate.scrollLeft - this.currentDaySize.actualValue
          let scroTop = this.$parent.$refs.chartBody.scrollTop
          this.$parent.$refs.chartDate.scrollLeft = z // this.$parent.$refs.chartDate.scrollTo(z, 0)
          this.$parent.$refs.chartBody.scrollTop = scroTop // this.$parent.$refs.chartBody.scrollTo(0, scroTop)
          this.$parent.$refs.shade.scrollTop = scroTop // this.$parent.$refs.shade.scrollTo(0, scroTop)
          let newWith = event.pageX - cp
          result = this.computedList[index].left + newWith
          if (result <= 0) result = 0
          line.style.left = result + 'px'
          if (this.drapDepen) {
            let newWiths = result - this.computedList[index].left
            this.depenList.forEach((k, a) => {
              this.lineList[a].style.left = this.computedList[this.indexList[a]].left + newWiths + 'px'
              this.resultList[a] = this.computedList[this.indexList[a]].left + newWiths
            })
          }
        } else {
          let newWith = event.pageX - cp
          result = this.computedList[index].left + newWith
          if (result <= 0) result = 0
          line.style.left = result + 'px'
          if (this.drapDepen) {
            let newWiths = result - this.computedList[index].left
            this.depenList.forEach((k, a) => {
              this.lineList[a].style.left = this.computedList[this.indexList[a]].left + newWiths + 'px'
              this.resultList[a] = this.computedList[this.indexList[a]].left + newWiths
            })
          }
        }
        this.lineMouseover(dom, e, id, parentId, index)
        this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (result == 0) {
          //
        } else if (!result) {
          document.onmousemove = document.onmouseup = null
          return
        }
        left = result
        line.style.left = left + 'px'
        this.checkIsin(dom, events, id, parentId, index)
        let selfResult = this.getTask(id)
        let undom = { type: 0 }
        try {
          this.leftRightDragHandler(selfResult.self, left, index, line, null, undom)
        } catch (error) {
          //window.console.log('error:', error)
        }
        this.changeTaskList()

        // if (checkResult || (checkResult == false && this.drapDepen && this.checkDepError == 'to')) {
        //   this.undoLists = this.undoList
        //   this.undoLists.push(undoItem)
        //   this.changeUnDoList()
        // }
        document.onmousemove = document.onmouseup = null
      }
    },
    //左右拖拽数据处理方法
    leftRightDragHandler(row, left, index, line, list, undom) {
      let thisList = []
      let flag = false
      let checkResult = true
      if (list) {
        thisList = list
      } else {
        thisList = this.currentTaskList
        flag = true
      }
      try {
        thisList.forEach((child) => {
          if (child.id === row.id) {
            let countStart = this.computedWithWithTime(left)
            let countEnd = this.computedWithWithTime(left + child.widthMe)
            checkResult = this.checkDependency(row, countStart, countEnd, null, 'all') //有错return false
            if (checkResult == false) {
              //有误，提出报错原因，并还原
              this.computedList[index].left = child.left
              if (line) {
                line.style.left = child.left + 'px'
              }

              if (this.depenList.length > 0) {
                this.depenList.forEach((k, a) => {
                  this.$refs['line' + k][0].style.left = this.computedList[this.indexList[a]].left + 'px'
                })
              }
              // window.console.log('222222222222222222222222this.resultList')
              // window.console.log(this.resultList)

              if (this.checkDepError == 'from') {
                throw 'from'
              } else if (this.checkDepError == 'to') {
                throw 'to'
              }
            } else {
              undom.old = {}
              undom.new = {}
              undom.old.idList = [child.id]
              undom.old.stList = [child.planBeginTime]
              undom.old.enList = [child.planEndTime]
              var diff = [left - child.left, countStart - child.planBeginTime, countEnd - child.planEndTime]
              this.computedList[index].left = left
              child.left = left
              child.planBeginTime = countStart
              child.planEndTime = countEnd
              undom.new.idList = [child.id]
              undom.new.stList = [countStart]
              undom.new.enList = [countEnd]
              if (this.drapDepen) {
                var count = 0
                this.dropDepen(diff, null, count, undom)
              }
              this.undoLists = this.undoList
              this.undoLists.push(undom)
              this.$parent.$parent.$refs.table.reundoTime('new', { ...undom }, null)
              this.changeUnDoList()
              if (flag != true) throw 'father'
            }
          } else {
            if (child.children && child.children.length > 0) {
              try {
                this.leftRightDragHandler(row, left, index, line, child.children, undom)
              } catch (error) {
                if (error === 'father' && flag) {
                  this.handlerFatherNode(child)
                } else if (error === 'father') {
                  throw error
                } else {
                  //window.console.error(error)
                  throw error
                }
              }
            }
          }
        })
      } catch (error) {
        if (error === 'from') this.$message.info('后一个任务的开始时间不能超过上一个任务的开始时间')
        else if (error === 'to') this.$message.info('上一个任务的开始时间不能晚于下一个任务的开始时间')
        else if (error != 'father' || flag != true) {
          if (error != 'father') window.console.error(error)
          throw error
        }
      }
    },
    //拖拽联动时处理联动的任务
    dropDepen(diff, list, count, undom) {
      //this.depenList
      var incount = 0
      try {
        if (list) {
          list.forEach((child) => {
            if (this.depenList.indexOf(child.id) >= 0) {
              undom.old.idList.push(child.id)
              undom.old.stList.push(child.planBeginTime)
              undom.old.enList.push(child.planEndTime)
              incount++
              child.left += diff[0]
              child.planBeginTime += diff[1]
              child.planEndTime += diff[2]
              undom.new.idList.push(child.id)
              undom.new.stList.push(child.planBeginTime)
              undom.new.enList.push(child.planEndTime)
              count++
              if (count >= this.depenList.length) {
                throw 'end'
              }
            } else if (child.children && child.children.length > 0) {
              this.dropDepen(diff, child.children, count, undom)
            }
          })
        } else {
          this.currentTaskList.forEach((child) => {
            if (this.depenList.indexOf(child.id) >= 0) {
              undom.old.idList.push(child.id)
              undom.old.stList.push(child.planBeginTime)
              undom.old.enList.push(child.planEndTime)
              incount++
              child.left += diff[0]
              child.planBeginTime += diff[1]
              child.planEndTime += diff[2]
              undom.new.idList.push(child.id)
              undom.new.stList.push(child.planBeginTime)
              undom.new.enList.push(child.planEndTime)
              count++
              if (count >= this.depenList.length) {
                throw 'end'
              }
            } else if (child.children && child.children.length > 0) {
              var result = false
              try {
                result = this.dropDepen(diff, child.children, count, undom)
              } catch (error) {
                if (error === 'end') {
                  this.handlerFatherNode(child)
                }
              }
              if (result) {
                this.handlerFatherNode(child)
              }
            }
          })
        }
      } catch (error) {
        //window.console.log('error:', error)
      }
      if (incount > 0) {
        return true
      }
      return false
    },
    //处理所有父节点
    handlerFatherNode(node) {
      var time = { startTime: null, endTime: null }
      node.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          var thisTime = this.handlerFatherNode(child)
          if (time.startTime === null || time.startTime > thisTime.startTime) time.startTime = thisTime.startTime
          if (time.endTime === null || time.endTime < thisTime.endTime) time.endTime = thisTime.endTime
        } else {
          if (time.startTime === null || time.startTime > child.planBeginTime) time.startTime = child.planBeginTime
          if (time.endTime === null || time.endTime < child.planEndTime) time.endTime = child.planEndTime
        }
      })
      //sinTask.widthMe = sinTask.widthChild
      node.left = this.computedTimeWidth(time.startTime)
      node.widthMe = node.widthChild = this.computedTimeWidth(time.startTime, time.endTime)
      return time
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    //鼠标悬停展示上部日期
    lineMouseover(dom, e, id, parentId, index) {
      this.isHover = true
      // this.handlerSelect(this.computedList[index])
      this.lineMouseenter(dom, e, id, parentId, index)
    },
    lineMouseleaveAndDrag(dom) {
      // let list = this.$refs[dom][0].children
      // for (let i = 0; i < list.length; i++) {
      //   if (list[i].className == 'leftCurDrag' || list[i].className == 'rightCurDrag') {
      //     list[i].style.display = 'none'
      //   }
      // }
      this.lineMouseleave()
    },
    //鼠标离开信息消失，时间显示消失
    /**
     * @param  {Object} e $event
     * @param  {Boolean} move 是否移动状态
     */
    lineMouseleave(e, move) {
      if (move) {
        this.isShowPop = false
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.changeIsShowMsg()
        }, 5)
        return
      }
      this.isHover = false
      this.isShowPop = false
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.changeIsShowMsg()
      }, 5)
      // this.handlerSelect()
    },
    lineMouseenterAndDrag(dom, e, id, parentId, index) {
      // let list = this.$refs[dom][0].children
      // for (let i = 0; i < list.length; i++) {
      //   if (list[i].className == 'leftCurDrag' || list[i].className == 'rightCurDrag') {
      //     list[i].style.display = 'block'
      //   }
      // }
      this.lineMouseenter(dom, e, id, parentId, index)
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    //鼠标进入显示当前项目的基本信息框
    lineMouseenter(dom, e, id, parentId, index, className) {
      //todo
      if (className == 'lineTwo') this.actual = true
      else this.actual = false
      var taskItem = this.computedList[index]
      this.$parent.popMsgList = this.handlePopMsg(taskItem)
      // if (this.computedList[index].type != 1 && this.computedList[index].type != 3) return
      let start = Math.round(parseInt(this.$refs[dom][0].style.left) / this.currentDaySize.value) * this.currentDaySize.value
      let end = parseInt(this.$refs[dom][0].style.left) + parseInt(this.$refs[dom][0].style.width)
      end = Math.round(end / this.currentDaySize.value) * this.currentDaySize.value - this.currentDaySize.value
      let distance = 0
      if (this.actual) distance = this.computedList[index].actualLeft - this.$parent.$refs.chartDate.scrollLeft + e.offsetX
      else distance = this.computedList[index].left - this.$parent.$refs.chartDate.scrollLeft + e.offsetX
      let topReset =
        this.computedList[index].top - this.$parent.$refs.chartBody.scrollTop + this.dateHeaderHeight * 2 + this.rowInHeight + this.rowHeight * 0.1
      this.currentProjectMsgPop = {
        left: distance + this.popWidth < this.$parent.chartDateWidth ? distance : distance - this.popWidth,
        top:
          topReset + this.$parent.popMsgList.length * 36 > this.$parent.chartDateHeight - this.dateHeaderHeight
            ? this.computedList[index].top -
              this.$parent.$refs.chartBody.scrollTop -
              this.$parent.popMsgList.length * 36 +
              this.dateHeaderHeight * 2 -
              this.rowHeight * 0.2
            : topReset,
      }
      let item = JSON.parse(JSON.stringify(this.computedList[index]))
      if (this.isUseDefaultPopup) {
        this.isShowPop = true
      } else {
        this.isShowPop = false
      }
      this.mouseover(item)
      this.changeCurrentProjectMsg()
      this.changeIsShowMsg()
    },
    mouseover(item) {
      this.$emit('mouseover', item)
    },
    handlePopMsg(taskItem) {
      var popList = []
      var popFormJson = this.popForm
      let parentItem = null
      let leftWidth = 0
      let rightWidth = 0
      popFormJson.forEach((child) => {
        if (child.text.startsWith('parent')) {
          let thisCon = child.text.split('&')
          let thisText = thisCon[1]
          if (parentItem === null) {
            parentItem = this.getTask(taskItem.parentId).self
          }
          if (parentItem[thisText]) {
            let pop = {}
            if (child.type === 'time')
              pop = { key: child.label ? child.label + '：' : thisText + '：', value: moment(parentItem[thisText]).format(child.formate) }
            else pop = { key: child.label ? child.label + '：' : thisText + '：', value: parentItem[thisText] }
            let keyWidth = this.getStringSpanWidth(pop.key)
            let valueWidth = this.getStringSpanWidth(pop.value)
            pop.keyWidth = keyWidth
            pop.valueWidth = valueWidth
            if(keyWidth>leftWidth) leftWidth = keyWidth
            if(valueWidth>rightWidth) rightWidth = valueWidth
            popList.push(pop)
          }
        }
        if (taskItem[child.text]) {
          let pop = {}
          if (child.type === 'time')
            pop = { key: child.label ? child.label + '：' : child.text + '：', value: moment(taskItem[child.text]).format(child.formate) }
          else pop = { key: child.label ? child.label + '：' : child.text + '：', value: taskItem[child.text] }
          let keyWidth = this.getStringSpanWidth(pop.key)
          let valueWidth = this.getStringSpanWidth(pop.value)
          pop.keyWidth = keyWidth
          pop.valueWidth = valueWidth
          if(keyWidth>leftWidth) leftWidth = keyWidth
          if(valueWidth>rightWidth) rightWidth = valueWidth
          popList.push(pop)
        }
      })
      this.popWidth = leftWidth + rightWidth
      return popList
    },
    getStringSpanWidth(str) {
      var width = 0
      var html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
    //左侧拖拽增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    leftCurDragMounsedown(dom, e, id, parentId, index) {
      if (this.disable == false || this.ganttMove == false) return
      let line = this.$refs[dom][0]
      let cx = e.pageX
      let result
      let result1
      let z = 0
      let x = 0
      let addwidth
      let timers
      let undoItem = {}
      undoItem.type = 1
      undoItem.id = id
      undoItem.dom = dom
      undoItem.old = {}
      undoItem.new = {}
      undoItem.index = index
      let checkleft = parseInt(line.style.left)
      let checkwidth = parseInt(line.style.width)
      document.onmousemove = (event) => {
        if (
          parseInt(line.style.left) - this.$parent.$refs.chartDate.scrollLeft <= 80 &&
          this.$parent.$refs.chartDate.scrollLeft >= this.currentDaySize.actualValue
        ) {
          if (!this.timer) {
            this.timer = window.setInterval(() => {
              z = this.$parent.$refs.chartDate.scrollLeft - this.currentDaySize.actualValue
              let scrTop = this.$parent.$refs.chartBody.scrollTop
              this.$parent.$refs.chartDate.scrollLeft = z // this.$parent.$refs.chartDate.scrollTo(z, 0)
              this.$parent.$refs.chartBody.scrollTop = scrTop // this.$parent.$refs.chartBody.scrollTo(0, scrTop)
              this.$parent.$refs.shade.scrollTop = scrTop // this.$parent.$refs.shade.scrollTo(0, scrTop)
              addwidth = cx - event.pageX
            }, 200)
          }
        } else if (
          parseInt(line.style.left) - this.$parent.$refs.chartDate.scrollLeft >=
          this.$parent.chartDateWidth - this.currentDaySize.actualValue
        ) {
          if (!timers) {
            timers = window.setInterval(() => {
              x = this.$parent.$refs.chartDate.scrollLeft + this.currentDaySize.actualValue
              let scrolTop = this.$parent.$refs.chartBody.scrollTop
              this.$parent.$refs.chartDate.scrollLeft = x // this.$parent.$refs.chartDate.scrollTo(x, 0)
              this.$parent.$refs.chartBody.scrollTop = scrolTop // this.$parent.$refs.chartBody.scrollTo(0, scrolTop)
              this.$parent.$refs.shade.scrollTop = scrolTop // this.$parent.$refs.shade.scrollTo(0, scrolTop)
              addwidth = -(event.pageX - cx)
            }, 200)
          }
        } else {
          window.clearInterval(this.timer)
          window.clearInterval(timers)
          this.timer = null
          timers = null
          if (event.pageX <= 0) {
            addwidth = -(-2 - cx)
          } else {
            addwidth = -(event.pageX - cx)
          }
        }
        result = this.computedList[index].widthMe + addwidth
        result1 = this.computedList[index].left - addwidth
        if (result < 0) {
          result = 0
          result1 = this.computedList[index].left + this.computedList[index].widthMe
        } else if (result1 <= 0) {
          result1 = 0
        }
        line.style.width = result + 'px'
        line.style.left = result1 + 'px'
        // this.computedList[index].widthChild = result
        this.lineMouseover(dom, e, id, parentId, index)
        this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (result == 0) {
          //
        } else if (!result) {
          this.$message.info('开始时间必须大于结束时间')
          line.style.left = checkleft + 'px'
          line.style.width = checkwidth + 'px'
          this.computedList[index].left = checkleft
          this.computedList[index].widthMe = checkwidth
          this.computedList[index].widthChild = checkwidth
          document.onmousemove = document.onmouseup = null
          return
        }
        let checkResult
        let redoItem = {}
        redoItem.type = 1
        window.clearInterval(this.timer)
        window.clearInterval(timers)
        this.timer = null
        timers = null
        // this.computedList[index].widthMe = result
        // this.computedList[index].widthChild = result
        line.style.width = result + 'px'
        // this.computedList[index].left = result1
        line.style.left = result1 + 'px'
        this.checkIsin(dom, events, id, parentId, index)
        let selfResult = this.getTask(id)
        var undom = { type: 1 }
        try {
          this.handlerOneSide(selfResult.self, index, line, result, result1, null, 'left', undom)
        } catch (error) {
         // window.console.error('error:', error)
        }
        this.changeTaskList()
        document.onmousemove = document.onmouseup = null
      }
    },
    handlerOneSide(row, index, line, result, result1, list, side, undom) {
      // window.console.log('handlerOneSide')
      // window.console.log(row)
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.currentTaskList
        flag = true
      }
      thisList.forEach((child) => {
        if (child.id === row.id) {
          try {
            let countStart = this.computedWithWithTime(result1)
            let countEnd = this.computedWithWithTime(result + child.left)
            let checkResult = false
            if (side === 'left') checkResult = this.checkDependency(child, countStart, child.planEndTime)
            if (side === 'right') checkResult = this.checkDependency(child, child.planBeginTime, countEnd)

            if (checkResult) {
              // window.console.log('if(checkResult)')
              undom.old = {}
              undom.new = {}
              undom.old.idList = [child.id]
              undom.old.stList = [child.planBeginTime]
              undom.old.enList = [child.planEndTime]
              child.widthMe = child.widthChild = result
              if (side === 'left') {
                child.left = result1
                child.planBeginTime = countStart
              } else if (side === 'right') {
                child.planEndTime = countEnd
              }
              undom.new.idList = [child.id]
              if (side === 'left') {
                undom.new.stList = [countStart]
                undom.new.enList = [child.planEndTime]
              } else if (side === 'right') {
                undom.new.stList = [child.planBeginTime]
                undom.new.enList = [countEnd]
              }
              this.$parent.$parent.$refs.table.reundoTime('new', undom, null)
              this.undoLists = this.undoList
              this.undoLists.push(undom)
              this.changeUnDoList()
              throw 'end'
            } else {
              this.computedList[index].widthMe = child.widthChild
              this.computedList[index].widthChild = child.widthMe
              this.computedList[index].left = child.left
              line.style.left = child.left + 'px'
              line.style.width = child.widthMe + 'px'
              return false
            }
          } catch (error) {
            if (error != 'end') {
              //window.console.error(error)
            }
            throw error
          }
        } else {
          if (child.children && child.children.length > 0) {
            try {
              this.handlerOneSide(row, index, line, result, result1, child.children, side, undom)
            } catch (error) {
              if (error === 'end' && flag === true) this.handlerFatherNode(child)
              else if (error != 'end' || flag != true) {
                if (error != 'end') window.console.error(error)
                throw error
              }
              return true
            }
          }
        }
      })
      return false
    },
    //右侧边缘增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    rightCurDragMounsedown(dom, e, id, parentId, index) {
      if (this.disable == false || this.ganttMove == false) return
      let line = this.$refs[dom][0]
      let cx = e.pageX
      let result
      let z = 0
      let x = 0
      let wx = this.$parent.$refs.chartDate.scrollLeft
      let addwidth
      let timers
      let undoItem = {}
      let oldleft = parseInt(line.style.left)
      undoItem.type = 2
      undoItem.id = id
      undoItem.dom = dom
      undoItem.old = {}
      undoItem.new = {}
      undoItem.index = index
      let checkwidth = parseInt(line.style.width)
      let checkResult
      document.onmousemove = (event) => {
        if (
          parseInt(line.style.left) + parseInt(line.style.width) - this.$parent.$refs.chartDate.scrollLeft >=
          this.$parent.chartDateWidth - this.currentDaySize.actualValue
        ) {
          //当鼠标处于右侧超出甘特图部分时，甘特图部分的滚动条向右滚动
          if (!this.timer) {
            z = 0
            wx = this.$parent.$refs.chartDate.scrollLeft
            this.timer = window.setInterval(() => {
              z = z + this.currentDaySize.actualValue
              let thisscrolly1 = this.$parent.$refs.chartBody.scrollTop
              this.$parent.$refs.chartDate.scrollLeft = z + wx //this.$parent.$refs.chartDate.scrollTo(z + wx, 0)
              this.$parent.$refs.chartBody.scrollTop = thisscrolly1 //this.$parent.$refs.chartBody.scrollTo(0, thisscrolly1)
              this.$parent.$refs.shade.scrollTop = thisscrolly1 //this.$parent.$refs.shade.scrollTo(0, thisscrolly1)
              addwidth = event.pageX - cx + z
            }, 200)
          }
        } else if (
          parseInt(line.style.left) + parseInt(line.style.width) - this.$parent.$refs.chartDate.scrollLeft <=
          this.currentDaySize.actualValue
        ) {
          //当鼠标处于左侧超出甘特图部分时，甘特图部分的滚动条向左滚动
          if (!timers) {
            timers = window.setInterval(() => {
              x = this.$parent.$refs.chartDate.scrollLeft - this.currentDaySize.actualValue
              this.$parent.$refs.chartDate.scrollLeft = x //this.$parent.$refs.chartDate.scrollTo(x, 0)
              addwidth = event.pageX - cx
            }, 200)
          }
        } else {
          window.clearInterval(this.timer)
          window.clearInterval(timers)
          this.timer = null
          timers = null
          addwidth = event.pageX - cx
        }
        result = this.computedList[index].widthMe + addwidth
        if (result + parseInt(line.style.left) >= this.dateTotalWidth) {
          result = this.dateTotalWidth - parseInt(line.style.left)
        }
        line.style.width = result + 'px'
        this.computedList[index].widthChild = result
        if (result < 0) {
          result = 0
        }
        this.lineMouseover(dom, e, id, parentId, index)
        this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (result == 0) {
          //
        } else if (!result) {
          this.$message.info('开始时间必须大于结束时间')
          line.style.left = oldleft + 'px'
          line.style.width = checkwidth + 'px'
          this.computedList[index].left = oldleft
          this.computedList[index].widthMe = checkwidth
          this.computedList[index].widthChild = checkwidth
          document.onmousemove = document.onmouseup = null
          return
        }
        window.clearInterval(this.timer)
        window.clearInterval(timers)
        this.timer = null
        timers = null
        this.computedList[index].widthMe = result
        this.computedList[index].widthChild = result
        line.style.width = result + 'px'
        this.checkIsin(dom, events, id, parentId, index)
        let selfResult = this.getTask(id)
        var undom = { type: 2 }
        try {
          this.handlerOneSide(selfResult.self, index, line, result, null, null, 'right', undom)
        } catch (error) {
          window.console.error('error:', error)
        }
        this.changeTaskList()
        document.onmousemove = document.onmouseup = null
      }
    },
    checkIsin(dom, events, id, parentId, index) {
      let line = this.$refs[dom][0]
      let lineTop = parseInt(line.style.top)
      let lineDown = lineTop + 16
      let lineLeft = parseInt(line.style.left)
      let lineRight = parseInt(this.computedList[index].widthMe) + lineLeft
      if (events.pageX >= lineLeft && events.pageX <= lineRight && events.y - this.rowHeight >= lineTop && events.y - this.rowHeight <= lineDown) {
        this.lineMouseover(dom, events, id, parentId, index)
        this.lineMouseenter(dom, events, id, parentId, index)
      } else {
        this.isShowPop = false
        this.changeIsShowMsg()
      }
    },
    //根据id设置group的宽度
    setGroupWidth(id, lists) {
      let parent
      if (lists) {
        parent = lists.find((item) => {
          return item.id == id
        })
      } else {
        parent = this.getTask(id).self
      }
      let left = Math.min.apply(
        Math,
        parent.children.map((o) => {
          return o.left
        })
      )
      let actualLeft = Math.min.apply(
        Math,
        parent.children
          .filter((task) => task.actualLeft != undefined)
          .map((o) => {
            return o.actualLeft
          })
      )
      let arr = []
      let preArr = []
      parent.children.forEach((item) => {
        arr.push(item.left + item.widthMe)
        if (item.actualLeft) {
          preArr.push(item.actualLeft + item.actualWidthMe)
        }
      })
      let width = Math.max.apply(Math, arr)
      let actualWidth = Math.max.apply(Math, preArr)
      let widthMe = width - left
      let actualWidthMe = actualWidth - actualLeft
      parent.widthMe = parent.widthChild = widthMe
      parent.actualWidthMe = parent.actualWidthChild = actualWidthMe
      parent.left = left
      parent.actualLeft = actualLeft
    },
    //滑动进度条事件
    thunkMousedown() {
      this.isShowPop = false
      this.changeIsShowMsg()
    },
    //滑动进度条事件
    thunkMouseup(percentage, e, id, parentId) {
      let undoItem = {}
      undoItem.id = id
      undoItem.type = 3
      undoItem.newper = percentage
      let cindex = this.computedList.findIndex((z) => {
        return z.id == id
      })
      if (parentId) {
        let result = this.getTask(id)
        let index = result.index
        let preindex = result.parindex
        let graindex = result.graindex
        switch (result.deep) {
          case 1:
            undoItem.oldper = this.currentTaskList[preindex].children[index].percentage
            this.currentTaskList[preindex].children[index].percentage = percentage
            break
          case 2:
            undoItem.oldper = this.currentTaskList[graindex].children[preindex].children[index].percentage
            this.currentTaskList[graindex].children[preindex].children[index].percentage = percentage
            break
          default:
            break
        }
        this.setGroupPer(parentId)
        if (preindex == -1) {
          this.$set(this.taskList, index, this.taskList[index])
        } else if (graindex == -1) {
          this.$set(this.taskList[preindex].children, index, this.taskList[preindex].children[index])
        } else {
          this.$set(this.taskList[graindex].children[preindex].children, index, this.taskList[graindex].children[preindex].children[index])
        }
      } else {
        this.currentTaskList.forEach((item) => {
          if (item.id == id) {
            undoItem.oldper = item.percentage
            item.percentage = percentage
          }
        })
      }
      this.undoLists = this.undoList
      this.undoLists.push(undoItem)
      this.changeUnDoList()
      this.changeTaskList()
      this.checkIsin(`line${id}`, e, id, parentId, cindex)
    },
    //滑动进度条事件
    thunkMousemove() {
      this.isShowPop = false
      this.changeIsShowMsg()
    },
    //里程碑去掉mouseenter显示
    // stoneLineMouseenter() {
    //   this.isShowPop = false
    //   this.changeIsShowMsg()
    // },
    // handlerSelect(row) {
    // this.$refs.leftMenu.handlerSelect(row)
    // },
    //根据距离计算时间，获得long
    computedWithWithTime(width) {
      //TODO获取总体开始时间,和单位距离
      let time = this.currentStartTime
      let unitTime = 0

      let countTime = (width / this.currentDaySize.actualValue) * this.currentDaySize.time + time.getTime()
      return countTime
    },
    // 根据时间计算距离
    computedTimeWidth(startTime, endTime) {
      //开始时间减去整个甘特图的开始时间
      let time = this.currentStartTime
      let left = ((startTime - time.getTime()) / this.currentDaySize.time) * this.currentDaySize.actualValue
      let width = ((endTime - startTime) / this.currentDaySize.time) * this.currentDaySize.actualValue
      //如果有结束时间测返回宽度，没有结束时间则返回开始的位置
      if (!endTime) {
        return left
      } else {
        return width
      }
    },
    //设置分组百分比
    setGroupPer(id, lists) {
      let z
      if (lists) {
        z = lists.find((o) => {
          return o.id == id
        })
      } else {
        z = this.getTask(id).self
      }
      let count = 0
      let length = z.children.length
      z.children.forEach((item) => {
        count = count + (item.percentage / 100) * (1 / length)
      })
      z.percentage = Math.round(count * 100)
    },
    getTask(id, list) {
      try {
        this.getOne(id, this.taskList)
      } catch (error) {
        if (error.item === 'get') return { self: error.self, deep: error.deep }
        else {
          window.console.log(error)
          return { self: null }
        }
      }
      return { self: null }
    },
    getOne(id, list) {
      list.forEach((child) => {
        if (child.id === id) {
          throw { item: 'get', self: child, deep: 1 }
        } else if (child.children && child.children.length > 0) {
          try {
            this.getOne(id, child.children)
          } catch (error) {
            if (error.item === 'get') {
              throw { item: 'get', self: error.self, deep: ++error.deep }
            } else {
              window.console.error(error)
              throw error
            }
          }
        }
      })
    },
    handlerCheckListTest() {
      if (this.currentTaskList.length < 1) return
      let headerHeight = 0 //时间头高度
      let wrapperHeight = this.rowHeight //每一行的高度
      // let nowHeight = 0 //用于累计计算top
      this.currentTaskList.forEach((item, index) => {
        item.planTime = []
        if (item.type == '3' || item.type == '4') {
          if (item.isexpand == undefined) {
            item.isexpand = true
          }
        }
        item.type = 4
        item.left = ''
        item.actualLeft = ''
        item.widthMe = item.widthChild = ''
        item.actualWidthMe = item.actualWidthChild = ''
        if (item.isShow == undefined) item.isShow = true
        //每一组的初始高度
        if (index < 1) {
          let firstTop = this.rowHeight / 5
          // if (this.rowHeight > 40) firstTop = 10
          item.top = headerHeight + this.firstTop
          this.nowHeight = item.top
        } else {
          this.nowHeight += wrapperHeight
          item.top = this.nowHeight
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach((child, j) => {
            child.type = 3
            child.left = ''
            child.actualLeft = ''
            child.widthMe = item.widthChild = ''
            child.actualWidthMe = item.actualWidthChild = ''
            if (child.isexpand == undefined) {
              child.isexpand = true
            }
            child.top = this.nowHeight + wrapperHeight
            if (child.isShow == undefined) child.isShow = true
            this.nowHeight = child.top
            if (child.children && child.children.length > 0) {
              child.children.forEach((k, z) => {
                k.type = 1
                k.planTime = []
                k.top = this.nowHeight + wrapperHeight
                this.nowHeight = k.top
                if (k.isShow == undefined) k.isShow = true
                k.left = this.computedTimeWidth(k.planBeginTime)
                k.widthMe = k.widthChild = this.computedTimeWidth(k.planBeginTime, k.planEndTime)
                if (k.actualBeginTime && k.actualEndTime) {
                  k.actualWidthMe = k.actualWidthChild = this.computedTimeWidth(k.actualBeginTime, k.actualEndTime)
                  k.actualLeft = this.computedTimeWidth(k.actualBeginTime)
                }
              })
              this.setGroupWidth(child.id, item.children)
              this.setGroupPer(child.id, item.children)
            }
          })
        }
      })
      this.changeTaskList()
      // this.setStoneLine(1)
      // window.scrollTo(this.currentTaskList[0].left - 100, 0)
      let scrollt = this.$parent.$refs.chartBody.scrollTop
      this.$parent.$refs.chartDate.scrollLeft = this.currentTaskList[0].left - 100 //this.$parent.$refs.chartDate.scrollTo(this.currentTaskList[0].left - 100, 0)
      this.$parent.$refs.chartBody.scrollTop = scrollt //this.$parent.$refs.chartBody.scrollTo(0, scrollt)
      this.$parent.$refs.shade.scrollTop = scrollt //this.$parent.$refs.shade.scrollTo(0, scrollt)
    },
    handlerCheckList(isDateRangeChange) {
      //isDateRangeChange:当前是否是快速定位日期显示范围
      // window.console.log('handlerCheckList')
      if (this.currentTaskList.length < 1) return
      let headerHeight = 0 //时间头高度
      let wrapperHeight = this.rowHeight //每一行的高度
      this.nowHeight = 0 //用于累计计算top
      this.nowHeight = headerHeight
      this.currentTaskList.forEach((item, index) => {
        var childTime = {
          planBeginTime: undefined,
          planEndTime: undefined,
          actualBeginTime: undefined,
          actualEndTime: undefined,
          percentage: [],
          sefil: false,
          chfil: 0,
          index: 0,
          expand: true,
        }
        this.handlerSingleTask(item, childTime, wrapperHeight)
      })
      this.currentTaskList.forEach((item) => {
        this.checkOutExpand(item, this.currentTaskList, false)
      })
      this.changeTaskList()
      let scrollt = this.$parent.$refs.chartBody.scrollTop

      if (!isDateRangeChange) {
        this.$parent.$refs.chartDate.scrollLeft = this.currentTaskList[0].left - 100 //this.$parent.$refs.chartDate.scrollTo(this.currentTaskList[0].left - 100, 0)
      }
      this.$parent.$refs.chartBody.scrollTop = scrollt //this.$parent.$refs.chartBody.scrollTo(0, scrollt)
      this.$parent.$refs.shade.scrollTop = scrollt //this.$parent.$refs.shade.scrollTo(0, scrollt)
    },
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
    handlerSingleTask(sinTask, fatherTime, wrapperHeight) {
      // if (sinTask.type == undefined) {
      //   sinTask.type == 'task'
      // }
      if (sinTask.isShow == undefined) sinTask.isShow = true
      var fil = true
      if (!fatherTime.sefil) {
        this.filter.forEach((child) => {
          fil = this.handlerFilter(sinTask)
        })
        if (fil) {
          fatherTime.chfil++
          sinTask.isShow = true
        } else if (sinTask.type === 'task') {
          sinTask.isShow = false
        }
      } else if (fatherTime.sefil === true) sinTask.isShow = true
      sinTask.top = this.nowHeight
      this.nowHeight = this.nowHeight + wrapperHeight
      if (sinTask.children) {
        if (sinTask.children.length > 0) {
          if (sinTask.isexpand == undefined) sinTask.isexpand = true
          var childTime = {
            planBeginTime: undefined,
            planEndTime: undefined,
            actualBeginTime: undefined,
            actualEndTime: undefined,
            percentage: [],
            sefil: fatherTime.sefil ? true : fil,
            chfil: 0,
            index: 0,
            expand: fatherTime.expand === false ? false : sinTask.isexpand,
          }
          sinTask.children.forEach((child) => {
            this.handlerSingleTask(child, childTime, wrapperHeight)
          })
          //处理完成度
          sinTask.percentage = 0
          childTime.percentage.forEach((p) => {
            sinTask.percentage += parseInt(p)
          })
          sinTask.percentage = Math.round(sinTask.percentage / childTime.percentage.length)
          fatherTime.percentage.push(sinTask.percentage)
          //处理时间
          if (childTime.planBeginTime && childTime.planEndTime) {
            if (fatherTime.planBeginTime) {
              if (fatherTime.planBeginTime > childTime.planBeginTime) fatherTime.planBeginTime = childTime.planBeginTime
            } else fatherTime.planBeginTime = childTime.planBeginTime
            if (fatherTime.planEndTime) {
              if (fatherTime.planEndTime < childTime.planEndTime) fatherTime.planEndTime = childTime.planEndTime
            } else fatherTime.planEndTime = childTime.planEndTime
            sinTask.left = this.computedTimeWidth(childTime.planBeginTime)
            sinTask.widthMe = sinTask.widthChild = this.computedTimeWidth(childTime.planBeginTime, childTime.planEndTime)
            if (childTime.actualBeginTime && childTime.actualEndTime) {
              if (fatherTime.actualBeginTime) {
                if (fatherTime.actualBeginTime > childTime.actualBeginTime) fatherTime.actualBeginTime = childTime.actualBeginTime
              } else fatherTime.actualBeginTime = childTime.actualBeginTime
              if (fatherTime.actualEndTime) {
                if (fatherTime.actualEndTime < childTime.actualEndTime) fatherTime.actualEndTime = childTime.actualEndTime
              } else fatherTime.actualEndTime = childTime.actualEndTime
              sinTask.actualWidthMe = sinTask.actualWidthChild = this.computedTimeWidth(childTime.actualBeginTime, childTime.actualEndTime)
              sinTask.actualLeft = this.computedTimeWidth(childTime.actualBeginTime)
            }
          }
          //处理高度问题
          if (!fatherTime.sefil && !fil) {
            this.nowHeight -= wrapperHeight * (sinTask.children.length - childTime.chfil)
          }
          //再处理isShow
          if (sinTask.type != 'task' && !fatherTime.sefil && !childTime.sefil && childTime.chfil === 0) {
            sinTask.isShow = false
          }
          if (!fil && childTime.chfil > 0) {
            sinTask.isShow = true
          }
          //处理chfil(子节点的)
          if (sinTask.type != 'task' && !childTime.sefil && !fatherTime.sefil && childTime.chfil > 0) {
            fatherTime.chfil++
          }
          if (!fatherTime.sefil && fatherTime.chfil === 0) {
            if (!fil) {
              this.nowHeight -= wrapperHeight
            }
          }
          if (fatherTime.chfil < 1 && fatherTime.index >= 0) {
            fatherTime.index++
          }
          if (fatherTime.chfil === 1 && fatherTime.index >= 0) {
            this.nowHeight += wrapperHeight * fatherTime.index
            fatherTime.index = -1
          }

          // if (sinTask.sefil) {
          //   if (sinTask.isexpand === false) {
          //     this.nowHeight -= wrapperHeight * sinTask.children.length
          //   }
          // } else {
          //   if (sinTask.isexpand === false) {
          //     this.nowHeight -= wrapperHeight * sinTask.children.length
          //   } else if (sinTask.isexpand === true) {
          //     this.nowHeight -= wrapperHeight * (sinTask.children.length - sinTask.chfil)
          //   }
          // }
        } else {
          // delete sinTask.percentage
          delete sinTask.left
          delete sinTask.widthMe
          delete sinTask.widthChild
          delete sinTask.actualWidthMe
          delete sinTask.actualLeft
          delete sinTask.actualWidthChild
        }
      } else {
        fatherTime.percentage.push(sinTask.percentage)
        if (sinTask.planBeginTime && sinTask.planEndTime) {
          if (fatherTime.planBeginTime) {
            if (fatherTime.planBeginTime > sinTask.planBeginTime) fatherTime.planBeginTime = sinTask.planBeginTime
          } else fatherTime.planBeginTime = sinTask.planBeginTime
          if (fatherTime.planEndTime) {
            if (fatherTime.planEndTime < sinTask.planEndTime) fatherTime.planEndTime = sinTask.planEndTime
          } else fatherTime.planEndTime = sinTask.planEndTime
          if (sinTask.isShow == undefined) sinTask.isShow = true
          sinTask.left = this.computedTimeWidth(sinTask.planBeginTime)
          sinTask.widthMe = sinTask.widthChild = this.computedTimeWidth(sinTask.planBeginTime, sinTask.planEndTime)
          if (sinTask.actualBeginTime && sinTask.actualEndTime) {
            if (fatherTime.actualBeginTime) {
              if (fatherTime.actualBeginTime > sinTask.actualBeginTime) fatherTime.actualBeginTime = sinTask.actualBeginTime
            } else fatherTime.actualBeginTime = sinTask.actualBeginTime
            if (fatherTime.actualEndTime) {
              if (fatherTime.actualEndTime < sinTask.actualEndTime) fatherTime.actualEndTime = sinTask.actualEndTime
            } else fatherTime.actualEndTime = sinTask.actualEndTime
            sinTask.actualWidthMe = sinTask.actualWidthChild = this.computedTimeWidth(sinTask.actualBeginTime, sinTask.actualEndTime)
            sinTask.actualLeft = this.computedTimeWidth(sinTask.actualBeginTime)
          }
        }
      }
    },
    checkOutExpand(sinTask, list, fafil) {
      if (sinTask.children && sinTask.children.length > 0) {
        let fil = this.handlerFilter(sinTask)
        sinTask.children.forEach((child) => {
          this.checkOutExpand(child, sinTask.children, fafil ? true : fil)
        })
      }
      if (sinTask.isexpand === false) {
        this.$parent.handlerExpand(sinTask.id, sinTask.isexpand, null, fafil)
      }
    },
    // setStoneLine(isFirst) {
    // this.$nextTick(() => {
    //   let arr = Array.from(document.getElementsByClassName('stoneLine'))
    //   let height = document.getElementsByClassName('chart-date')[0].offsetHeight - 42
    //   height = isFirst ? parseFloat(height) : parseFloat(height) - 16.8
    //   arr.forEach((e) => {
    //     e.style.height = height + 'px'
    //   })
    // })
    // },

    checkDependency(row, startTime, endTime, list, type) {
      let checkResult = true
      try {
        this.checkDependencyOne(row, startTime, endTime, this.taskList, type)
      } catch (error) {
        checkResult = false
        if (error == 'from') {
          this.$message.info('后一个任务的开始时间不能超过上一个任务的开始时间')
        } else if (error == 'to') {
          this.$message.info('上一个任务的开始时间不能晚于下一个任务的开始时间')
        } else {
          window.console.log('error')
          throw error
        }
      }
      return checkResult
    },
    checkDependencyOne(row, startTime, endTime, list, type) {
      list.forEach((child) => {
        if (row.dependOn && row.dependOn.indexOf(child.id) >= 0) {
          if (child.planBeginTime > startTime) {
            throw 'from'
          }
        }
        if (child.dependOn && child.dependOn.length > 0) {
          if (child.dependOn.indexOf(row.id) >= 0) {
            if (startTime > child.planBeginTime) {
              throw 'to'
            }
          }
        }
        if (child.children && child.children.length > 0) {
          this.checkDependencyOne(row, startTime, endTime, child.children, type)
        }
      })
    },
    changeTaskList() {
      this.$emit('update:taskList', this.currentTaskList)
      this.$set(this.taskList, 0, this.taskList[0])
    },
    // onRightMenuChoose(menu) {
    //   if (menu === '锁定产线') {
    //     console.log('锁定产线')
    //   }
    // },
    changeIsShowMsg() {
      this.$emit('update:isShowMsg', this.isShowPop)
    },
    changeCurrentProjectMsg() {
      this.$emit('update:currentProjectMsg', this.currentProjectMsgPop)
    },
    changeReDoList() {
      this.$emit('update:redoList', this.redoLists)
    },
    changeUnDoList() {
      this.$emit('update:undoList', this.undoLists)
    },
    dblclickRowWrapper(task) {
      this.$emit('dblclickRowWrapper', task)
    },
    clickRowWrapper(task) {
      this.$parent.$refs.gridLine.handleClick(task)
      this.$emit('clickRowWrapper', task)
    },
    rightClickRowWrapper(task, e) {
      // var distance = task.left + task.widthMe
      // var topReset = task.top
      // this.$refs.ctxMenu.open()
      // this.$refs.ctxMenu.ctxLeft = distance
      // this.$refs.ctxMenu.ctxTop = topReset
      this.$emit('rightClickRowWrapper', { ...task })
    },
    reundoTime(type, doItem, list) {
      if (type == null || doItem == null) return
      let timeList = []
      if (type === 'old') {
        timeList = doItem.old
      } else if (type === 'new') {
        timeList = doItem.new
      }
      var has = ''
      var flag = false
      var thisList = []
      if (list) thisList = list
      else {
        thisList = this.taskList
        flag = true
      }
      thisList.forEach((child) => {
        var index = timeList.idList.indexOf(child.id)
        if (index >= 0) {
          has = 'father'
          child.planBeginTime = timeList.stList[index]
          child.planEndTime = timeList.enList[index]
          child.left = this.computedTimeWidth(timeList.stList[index])
          child.widthChild = child.widthMe = this.computedTimeWidth(timeList.stList[index], timeList.enList[index])
        } else {
          if (child.children && child.children.length > 0) {
            let result = this.reundoTime(type, doItem, child.children)
            if (result === 'father') {
              if (flag) {
                this.handlerFatherNode(child)
              } else {
                has = 'father'
              }
            }
          }
        }
      })
      if (flag) this.changeTaskList()
      return has
    },
    reundoPer(per, doItem) {
      let result = this.getTask(doItem.id)
      this.currentTaskList[result.graindex].children[result.parindex].children[result.index].percentage = per
      let refid = 'slider' + doItem.id
      this.$refs[refid][0].percentage = per
      this.setGroupPer(this.currentTaskList[result.graindex].children[result.parindex].id)
      this.$set(
        this.taskList[result.graindex].children[result.parindex].children,
        result.index,
        this.taskList[result.graindex].children[result.parindex].children[result.index]
      )
      this.changeTaskList()
    },
    //给出格式化的时间string
    /**
     * @param  {Number} width
     * @param  {Boolean|String} time
     */
    computedWithTime(width, time) {
      // let startTime = Math.round(
      //   (width / this.currentDaySize.actualValue) * this.currentDaySize.time + new Date(`${this.currentYear - 1}/01/01`).getTime()
      // )
      let s = new Date(width)
      if (time && time == true) {
        return s.getTime()
      } else if (time && time == 'YD') {
        return `${s.getFullYear()}年${s.getMonth() + 1}月`
      } else {
        return (
          s.getFullYear() +
          '-' +
          (s.getMonth() < 9 ? '0' + (s.getMonth() + 1) : s.getMonth() + 1) +
          '-' +
          (s.getDate() < 10 ? '0' + s.getDate() : s.getDate()) +
          ' ' +
          (s.getHours() < 10 ? '0' + s.getHours() : s.getHours()) +
          ':' +
          (s.getMinutes() < 10 ? '0' + s.getMinutes() : s.getMinutes())
        )
      }
    },
    consoleTime() {
      this.taskList.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((child) => {
            if (child.children && child.children.length > 0) {
              child.children.forEach((k) => {
                let startTime = k.planBeginTime
                let endTime = k.planEndTime
                let start = new Date(startTime)
                let end = new Date(endTime)
                let startTime2 = this.computedWithWithTime(k.left)
                let start2 = new Date(startTime2)
                // window.console.log(k.id)
                // window.console.log(
                //   'start:' +
                //     start.getFullYear() +
                //     '_' +
                //     (start.getMonth() + 1) +
                //     '_' +
                //     start.getDate() +
                //     '_' +
                //     start.getHours() +
                //     '_' +
                //     start.getMinutes() +
                //     '_' +
                //     start.getSeconds()
                // )
                // window.console.log(
                //   'start2:' +
                //     start2.getFullYear() +
                //     '_' +
                //     (start2.getMonth() + 1) +
                //     '_' +
                //     start2.getDate() +
                //     '_' +
                //     start2.getHours() +
                //     '_' +
                //     start2.getMinutes() +
                //     '_' +
                //     start2.getSeconds()
                // )
                // window.console.log(
                //   'end:' +
                //     end.getFullYear() +
                //     '_' +
                //     (end.getMonth() + 1) +
                //     '_' +
                //     end.getDate() +
                //     '_' +
                //     end.getHours() +
                //     '_' +
                //     end.getMinutes() +
                //     '_' +
                //     end.getSeconds()
                // )
              })
            }
          })
        }
      })
    },
    refreshData() {
      // window.console.log('refreshData')
      // window.console.log(this.taskList)
      this.currentTaskList = this.taskList
      this.redoLists = this.redoList
      this.undoLists = this.undoList
      this.handlerCheckList(false)
    },
    computedListOne(item, list) {
      item.forEach((child) => {
        list.push(child)
        if (child.children && child.children.length > 0) {
          this.computedListOne(child.children, list)
        }
      })
    },
  },
  mounted() {
    this.currentTaskList = this.taskList
    this.redoLists = this.redoList
    this.undoLists = this.undoList
    this.handlerCheckList(false)
  },
  created() {},
  watch: {
    rowHeight() {
      this.handlerCheckList(false)
    },
    taskList() {
      //window.console.log('==============taskList')
      //window.console.log(this.taskList)
    },
    filter() {
      //window.console.log('---------filter')
      this.handlerCheckList(false)
    },
  },
}
</script>

<style scoped>
.group {
  position: absolute;
  z-index: 3;
  /* background-color: #909090 !important; */
  border: none !important;
  border-radius: 0 !important;
  /* height: 14px !important; */
  /* line-height: 14px !important; */
  clip-path: polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 100%, 0 0);
}
.project {
  position: absolute;
  z-index: 3;
  /* background-color: #909090 !important; */
  border: none !important;
  border-radius: 0 !important;
  /* height: 14px !important; */
  /* line-height: 14px !important; */
  clip-path: polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 100%, 0 0);
}
.progress {
  /* background-color: #606060 !important; */
  height: 100%;
}
.line {
  position: absolute;
  z-index: 3;
}
.rightCurDrag {
  cursor: e-resize;
  width: 5px;
  background-color: rgba(119, 119, 119, 0.5);
  /* height: 12px; */
  position: absolute;
  z-index: 3;
  right: -6px;
  transform: translateY(-50%);
  top: 50%;
  border-radius: 3px;
  user-select: none;
  display: none;
}
.leftCurDrag {
  cursor: e-resize;
  width: 5px;
  background-color: rgba(119, 119, 119, 0.5);
  /* height: 12px !important; */
  position: absolute;
  z-index: 3;
  left: -6px;
  transform: translateY(-50%);
  top: 50%;
  border-radius: 3px;
  user-select: none;
  display: none;
}
.stoneLine {
  position: absolute;
  z-index: 3;
  top: 0px;
  left: 50%;
  margin-left: -1px;
  width: 2px;
  background-color: #24b47e;
}
.milestone {
  position: absolute;
  z-index: 3;
  left: 50%;
  cursor: move;
  margin-left: -10px;
  width: 20px;
  height: 20px;
  background-color: #24b47e;
  transform: rotate(-45deg);
  display: flex;
  justify-content: center;
  align-items: center;
}
.milestone i {
  transform: rotate(45deg);
  color: #fff;
  z-index: 1;
}
.lineTwo {
  position: absolute;
  z-index: 3;
  /* height: 12px; */
  /* background-color: #244089; */
}
</style>