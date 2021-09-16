<template>
  <div>
    <div class="dependencies-lines" v-for="(task,i) in dependencyTasks" :key="task.id" :task="task">
      <div class="dependency-lines-es" v-for="(lineDates,indexs) in task.lineDates" :ref="'depen_'+i" :key="task.id+'_es_'+indexs"
        @mouseover="mouseover(`depen_${i}`)" @mouseleave="mouseleave(`depen_${i}`)">
        <div class="dependency-lines" v-for="(lineDate,index) in lineDates.points" :key="task.id+'_'+index">
          <div class="dependency-line-container"
            :style="{top:(lineDate.outPart.top+topDistance)+'px',left:lineDate.outPart.left+'px',height:lineDate.outPart.height+'px',width:lineDate.outPart.width+'px'}">
            <div class="dependency-line"
              :style="{width:lineDate.inPart.width+'px',height:lineDate.inPart.height+'px','margin-top':(lineDate.inPart.top+topDistance)+'px','margin-left':lineDate.inPart.left+'px','box-shadow':dependencyColor,'background-color':dependencyColor,}" />
          </div>
        </div>
        <div class="icon-dependency"
          :style="{top:(task.lineDates[0].points[0].icon.top+topDistance)+'px',left:task.lineDates[0].points[0].icon.left+4+'px',width:'6px'}">
          <svg width="6px" height="9px" viewBox="0 0 4 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="APS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="三角形" :fill="dependencyColor" fill-rule="nonzero">
                <polygon id="矩形-copy-42" points="0 0 0 6 4 3"></polygon>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  gStyle: { fill: 'transparent', stroke: '#00a1eb', 'stroke-width': 2 },
  props: [
    'taskList',
    'rowHeight',
    'activeShowValue',
    'dependencyRef',
    'dependencyColor',
    'rowHeightModel',
    'setFirstTop',
    'setRowInHeightT',
    'setRowInHeightS',
    'dependencyWidth',
  ],
  data() {
    return {}
  },
  methods: {
    getPoints(fromId, toId) {
      let fromTask = this.getTask(fromId).task
      let toTask = this.getTask(toId).task
      if (fromTask === undefined || toTask === undefined) {
        return null
      }
      if (fromTask === null || toTask === null || !fromTask.isShow || !toTask.isShow) {
        return null
      }
      const startX = fromTask.left + fromTask.widthMe
      const startY = fromTask.top
      const stopX = toTask.left
      const stopY = toTask.top
      const distanceX = stopX - startX
      let distanceY
      let yMultiplier = 1
      if (stopY >= startY) {
        distanceY = stopY - startY
      } else {
        distanceY = startY - stopY
        yMultiplier = -1
      }
      const offset = 10
      const roundness = 4
      const isBefore = distanceX <= 30
      let lineDates = []
      let firstTop = this.rowHeight / 4
      if (yMultiplier == 1) {
        if (isBefore) {
          lineDates.push({
            outPart: {
              width: 14 + this.dependencyWidth / 2,
              height: this.dependencyWidth,
              top: startY + this.firstTop + this.rowInHeight / 2 - this.dependencyWidth / 2,
              left: startX,
            },
            inPart: { width: 14 + this.dependencyWidth / 2, left: 0, height: this.dependencyWidth, top: 0 },
            icon: { top: stopY + this.firstTop + this.rowInHeight / 2 - 11, left: stopX - 10, fill: '#00a1eb' },
          })
          lineDates.push({
            outPart: {
              width: this.dependencyWidth,
              // height: stopY - startY - this.rowInHeight / 2 - this.rowHeight / 4 + 5,
              height: stopY - startY - this.rowInHeight / 2 - this.firstTop / 2 + this.dependencyWidth - 1,
              top: startY + this.firstTop + this.rowInHeight / 2,
              left: startX + 14 - this.dependencyWidth / 2,
            },
            inPart: { width: this.dependencyWidth, left: 0, height: stopY - startY - this.rowInHeight / 2 - this.firstTop / 2 + 1, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: startX - stopX + 28 + this.dependencyWidth,
              height: this.dependencyWidth,
              top: stopY + this.firstTop / 2 - this.dependencyWidth / 2,
              left: stopX - 14 - this.dependencyWidth / 2,
            },
            inPart: { width: startX - stopX + 28 + this.dependencyWidth, left: 0, height: this.dependencyWidth, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: this.dependencyWidth,
              height: this.rowInHeight / 2 + this.firstTop / 2 + 1,
              top: stopY + this.firstTop / 2,
              left: stopX - 14 - this.dependencyWidth / 2,
            },
            inPart: { width: this.dependencyWidth, left: 0, height: this.rowInHeight / 2 + this.firstTop / 2 + 1, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: 13,
              height: this.dependencyWidth,
              top: stopY + this.firstTop + this.rowInHeight / 2 - this.dependencyWidth / 2,
              left: stopX - 14 - this.dependencyWidth / 2,
            },
            inPart: { width: 13, left: 0, height: this.dependencyWidth, top: 0 },
          })
        } else {
          lineDates.push({
            outPart: {
              width: 14 + this.dependencyWidth / 2,
              height: this.dependencyWidth,
              top: startY + this.rowInHeight / 2 + this.firstTop - this.dependencyWidth / 2,
              left: startX,
            },
            inPart: { width: 14 + this.dependencyWidth / 2, left: 0, height: this.dependencyWidth, top: 0 },
            icon: { top: stopY + this.rowInHeight / 2 - 11 + this.firstTop, left: stopX - 10, fill: '#00a1eb' },
          })
          lineDates.push({
            outPart: {
              width: this.dependencyWidth,
              height: stopY - startY + 2,
              top: startY + this.rowInHeight / 2 + this.firstTop - 1,
              left: startX + 14 - this.dependencyWidth / 2,
            },
            inPart: { width: this.dependencyWidth, left: 0, height: stopY - startY + 2, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: Math.abs(startX - stopX) - 15,
              height: this.dependencyWidth,
              top: stopY + this.rowInHeight / 2 + this.firstTop - this.dependencyWidth / 2,
              left: startX + 14 - this.dependencyWidth / 2,
            },
            inPart: { width: Math.abs(startX - stopX) - 15, left: 0, height: this.dependencyWidth, top: 0 },
          })
        }
      } else {
        if (isBefore) {
          lineDates.push({
            outPart: {
              width: 14 + this.dependencyWidth / 2,
              height: this.dependencyWidth,
              top: startY + this.rowInHeight / 2 - this.dependencyWidth / 2 + this.firstTop,
              left: startX,
            },
            inPart: { width: 14 + this.dependencyWidth / 2, left: 0, height: this.dependencyWidth, top: 0 },
            icon: { top: stopY + this.rowInHeight / 2 - 11 + this.firstTop, left: stopX - 10, fill: '#00a1eb' },
          })
          lineDates.push({
            outPart: {
              width: this.dependencyWidth,
              height: this.firstTop / 2 + this.rowInHeight / 2 + 2,
              top: startY + this.firstTop / 2 - 2,
              left: startX + 14 - this.dependencyWidth / 2,
            },
            inPart: { width: this.dependencyWidth, left: 0, height: this.firstTop / 2 + this.rowInHeight / 2 + 2, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: startX - stopX + 28 + this.dependencyWidth,
              height: this.dependencyWidth,
              top: startY + this.firstTop / 2 - 1 - this.dependencyWidth / 2,
              left: stopX - 14 - this.dependencyWidth / 2,
            },
            inPart: { width: startX - stopX + 28 + this.dependencyWidth, left: 0, height: this.dependencyWidth, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: this.dependencyWidth,
              height: startY - stopY - this.rowInHeight / 2 - this.firstTop / 2 + 1,
              top: stopY + this.rowInHeight / 2 + this.firstTop - 1,
              left: stopX - 14 - this.dependencyWidth / 2,
            },
            inPart: { width: this.dependencyWidth, left: 0, height: startY - stopY - this.rowInHeight / 2 - this.firstTop / 2 + 1, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: 13,
              height: this.dependencyWidth,
              top: stopY + this.rowInHeight / 2 - this.dependencyWidth / 2 + this.firstTop,
              left: stopX - 14 - this.dependencyWidth / 2,
            },
            inPart: { width: 13, left: 0, height: this.dependencyWidth, top: 0 },
          })
        } else {
          lineDates.push({
            outPart: {
              width: 14 + this.dependencyWidth / 2,
              height: this.dependencyWidth,
              top: startY + this.rowInHeight / 2 - this.dependencyWidth / 2 + this.firstTop,
              left: startX,
            },
            inPart: { width: 14 + this.dependencyWidth / 2, left: 0, height: this.dependencyWidth, top: 0 },
            icon: { top: stopY + this.rowInHeight / 2 - 11 + this.firstTop, left: stopX - 10, fill: '#00a1eb' },
          })
          lineDates.push({
            outPart: {
              width: this.dependencyWidth,
              height: startY - stopY + 2,
              top: stopY + this.rowInHeight / 2 + this.firstTop - 1,
              left: startX + 14 - this.dependencyWidth / 2,
            },
            inPart: { width: this.dependencyWidth, left: 0, height: startY - stopY + 2, top: 0 },
          })
          lineDates.push({
            outPart: {
              width: Math.abs(startX - stopX) - 15,
              height: this.dependencyWidth,
              top: stopY + this.rowInHeight / 2 - this.dependencyWidth / 2 + this.firstTop,
              left: startX + 14 - this.dependencyWidth / 2,
            },
            inPart: { width: Math.abs(startX - stopX) - 15, left: 0, height: this.dependencyWidth, top: 0 },
          })
        }
      }

      return lineDates
    },
    getTask(id, list) {
      try {
        this.getOne(id, this.taskList)
      } catch (error) {
        if (error.item === 'get') return { task: error.task }
        else {
          //window.console.log(error)
          return { task: null }
        }
      }
      return { task: null }
    },
    getOne(id, list) {
      list.forEach((child) => {
        if (child.id === id) {
          throw { item: 'get', task: { ...child } }
        } else if (child.children && child.children.length > 0) {
          this.getOne(id, child.children)
        }
      })
    },
    computedListOne(item, list) {
      item.forEach((child) => {
        list.push(child)
        if (child.children && child.children.length > 0) {
          this.computedListOne(child.children, list)
        }
      })
    },
    mouseover(dom) {
      let dep = this.$refs[dom][0]
      if (dep) {
        dep.classList.add('dependency-shadow')
      }
    },
    mouseleave(dom) {
      let dep = this.$refs[dom][0]
      if (dep) {
        dep.classList.remove('dependency-shadow')
      }
    },
  },
  computed: {
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
    firstTop() {
      if (this.rowHeightModel) {
        return this.rowHeight / 5
      } else {
        return this.setFirstTop
      }
    },
    topDistance() {
      // return this.setFirstTop - 0.2 * this.rowHeight
      return 0
    },
    dependencyTasks() {
      this.dependencyRef
      let computed_1 = this.computedList.filter((task) => typeof (task.dependOn != null && task.dependOn != undefined))
      let computed_2 = []
      computed_1.forEach((task) => {
        if (task.dependOn) {
          if (task.dependOn.length > 0) {
            computed_2.push(task)
          }
        }
      })
      return computed_2
        .map((task) => {
          task.lineDates = task.dependOn.map((id) => {
            return { points: this.getPoints(id, task.id) }
          })
          return task
        })
        .filter((task) => task.lineDates[0].points !== null)
    },
    computedList() {
      let arr = []
      this.computedListOne(this.taskList, arr)
      return arr
    },
    lineWidth() {
      return this.dependencyWidth + 2
    },
    lineDis() {
      return 1
    },
  },
  watch: {
    dependencyRef() {
      //window.console.log('dependencyRef')
      if (this.dependencyRef) {
        this.$emit('ref-ok', true)
      } else {
        this.$emit('ref-of', false)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.dependency-line-container {
  position: absolute;
  z-index: 4;
  /* cursor: pointer; */
}
/* .dependency-line {
  box-shadow: #00a1eb;
  background-color: #00a1eb;
} */
.icon-dependency {
  position: absolute;
  z-index: 4;
}
.dependency-lines-es.dependency-shadow {
  .dependency-lines {
    .dependency-line-container {
      .dependency-line {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 1);
      }
    }
  }
}
</style>