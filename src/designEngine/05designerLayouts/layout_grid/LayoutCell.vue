<template>
  <div style="height:100%;width:100%;position:relative" ref="compContainer">
    <!-- **************外部drop区域**************************************************************************** -->
    <!--上-->
    <div class="outer" v-if="1==2" ref="drag_up_outer" style="width:100%;height:5%;left:0px; top:0px;position:absolute;" draggable="false">
    </div>
    <!--下-->
    <div class="outer" v-if="1==2" ref="drag_down_outer" style="width:100%;height:5%;left:0px; bottom:0px;position:absolute;" draggable="false">
    </div>
    <!--左-->
    <div class="outer" v-if="1==2" ref="drag_left_outer" style="width:5%;height:90%;top:5%; left:0px;position:absolute;" draggable="false">
    </div>
    <!--右-->
    <div class="outer" v-if="1==2" ref="drag_right_outer" style="width:5%;height:90%;top:5%; right:0px;;position:absolute;;" draggable="false">
    </div>

    <a-row class="myrow" draggable="false" :style="{'height':upRow.height}" ref="upRow">
      <div ref="compArea_up" style="height:100%;width:100%"></div>
    </a-row>

    <a-row class="myrow" draggable="false" :style="{'height':centerRow.height}" ref="centerRow">
      <a-col class="mycol" :style="{'height':leftCol.height}" :span="leftCol.span" ref="leftCol">
        <div ref="compArea_left" style="height:100%;width:100%"></div>
      </a-col>

      <a-col class="mycol" :style="{'height':centerCol.height}" style="position:relative" :span="centerCol.span" ref="centerCol">
        <!-- **************内部drop区域**************************************************************************** -->
        <!--上-->
        <div class="inner" v-if="!upRow.vueComp" ref="drag_up_inner" style="width:100%;height:10%;left:0%; top:0%;position:absolute;"
          draggable="false">
        </div>
        <!--下-->
        <div class="inner" v-if="!downRow.vueComp" ref="drag_down_inner" style="width:100%;height:10%;left:0%; bottom:0%;position:absolute;"
          draggable="false">
        </div>
        <!--左-->
        <div class="inner" v-if="!leftCol.vueComp" ref="drag_left_inner" style="width:50%;height:80%;top:10%; left:0%;position:absolute;"
          draggable="false">
        </div>
        <!--右-->
        <div class="inner" v-if="!rightCol.vueComp" ref="drag_right_inner" style="width:50%;height:80%;top:10%; right:0%;position:absolute;2;"
          draggable="false">
        </div>

        <div ref="compArea" style="height:100%;width:100%"></div>
      </a-col>

      <a-col class="mycol" :style="{'height':rightCol.height}" :span="rightCol.span" ref="rightCol">
        <div ref="compArea_right" style="height:100%;width:100%"></div>
      </a-col>

    </a-row>

    <a-row class="myrow" draggable="false" :style="{'height':downRow.height}" ref="downRow">
      <div ref="compArea_down" style="height:100%;width:100%"></div>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import dragHelper from '../../02common/dragHelper'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import PageBase from '../PageBase'
import common from '../../02common/commonMethod'
import BaseEvent from '../../03designerLayoutBase/BaseEvents'

import {  AllComponents, ComponentBase } from '../../04designerComponents'

import { rowData, colData, colDataBase, rowDataBase } from './Layout_Classes'
import { Row, Col } from 'ant-design-vue'

class rowDataForSave extends rowDataBase {
  layotCellData: dataForSave
}
class colDataForSave extends colDataBase {
  layotCellData: dataForSave | any //可能是组件数据，也有可能是一个layoutCell的数据
}
export class dataForSave {
  upRowData: rowDataForSave
  downRowData: rowDataForSave
  centerRowData: rowDataForSave
  leftColData: colDataForSave
  rightColData: colDataForSave
  centerColData: colDataForSave
}

enum dragArea {
  drag_up_inner = 'drag_up_inner',
  drag_down_inner = 'drag_down_inner',
  drag_left_inner = 'drag_left_inner',
  drag_right_inner = 'drag_right_inner',
}

@Component
export default class LayoutCell extends BaseEvent {
  // ********栅栏布局容器*************************************
  public upRow: rowData = new rowData()
  private centerRow: rowData = new rowData()
  public downRow: rowData = new rowData()

  public leftCol: colData = new colData()
  public centerCol: colData = new colData()
  public rightCol: colData = new colData()
  // **********组件填充布局***********************************
  private get compArea(): Element {
    return this.$refs.compArea as Element
  }
  private get compArea_up(): Element {
    return this.$refs.compArea_up as Element
  }
  private get compArea_down(): Element {
    return this.$refs.compArea_down as Element
  }
  private get compArea_right(): Element {
    return this.$refs.compArea_right as Element
  }
  private get compArea_left(): Element {
    return this.$refs.compArea_left as Element
  }
  // ********************************************* */
  mounted() {
    this.CaptureEvent()
    this.canDrop = true
    this.canDrag = true
    this.onDrop_Event = this.listenOnDrop
    // this.onDragMove_Event = this.listenOnDragMove;
    this.onDragOver_Event = this.listenOnDragOver
    this.onDragOut_Event = this.listenOnDragOut
    /** */
    this.upRow.layoutRow = this.$refs['upRow'] as Row
    this.centerRow.layoutRow = this.$refs['centerRow'] as Row
    this.downRow.layoutRow = this.$refs['downRow'] as Row
    this.leftCol.layoutCol = this.$refs['leftCol'] as Col
    this.centerCol.layoutCol = this.$refs['centerCol'] as Col
    this.rightCol.layoutCol = this.$refs['rightCol'] as Col
  }
  // ***********拖拽处理**************************************************************************
  public IsListenedDrop: boolean = false
  public DropArea: string

  public clearBoarder() {
    $(this.centerCol.layoutCol.$el).css('border-top', '')
    $(this.centerCol.layoutCol.$el).css('border-bottom', '')
    $(this.centerCol.layoutCol.$el).css('border-left', '')
    $(this.centerCol.layoutCol.$el).css('border-right', '')
  }

  public makeDragBoarder() {
    if (this.DropArea == dragArea.drag_up_inner) {
      $(this.centerCol.layoutCol.$el).css('border-top', '5px solid red')
    } else if (this.DropArea == dragArea.drag_down_inner) {
      $(this.centerCol.layoutCol.$el).css('border-bottom', '5px solid red')
    } else if (this.DropArea == dragArea.drag_left_inner) {
      $(this.centerCol.layoutCol.$el).css('border-left', '5px solid red')
    } else if (this.DropArea == dragArea.drag_right_inner) {
      $(this.centerCol.layoutCol.$el).css('border-right', '5px solid red')
    }
  }

  private listenOnDrop(el: Element, targetContainer: Element, screenLeft: number, screenTop: number): boolean {
    // if (this.IsListenedDrop) {
    // window.console.log("收到dop:", this.DropArea, this.$el);
    // }
    this.clearBoarder()
    return true
  }

  private listenOnDragMove(startLeft_screen: number, startTop_screen: number, endLeft_screen: number, endTop_screen: number, el: Element): boolean {
    var mouseEvent = window.event as MouseEvent
    this.DropArea = this.cuteDropPosition(mouseEvent.clientX, mouseEvent.clientY)
    //window.console.log('正在dragmove:', this.DropArea)
    this.clearBoarder()
    this.makeDragBoarder()
    return false
  }

  private cuteDropPosition(screenLeft: number, screenTop: number): string {
    // window.console.log('cuteDropPosition', screenLeft, screenTop)
    var infos = []
    infos.push({
      type: dragArea.drag_up_inner,
      dom: this.$refs[dragArea.drag_up_inner],
    })
    infos.push({
      type: dragArea.drag_down_inner,
      dom: this.$refs[dragArea.drag_down_inner],
    })
    infos.push({
      type: dragArea.drag_left_inner,
      dom: this.$refs[dragArea.drag_left_inner],
    })
    infos.push({
      type: dragArea.drag_right_inner,
      dom: this.$refs[dragArea.drag_right_inner],
    })

    var area = ''
    for (var i = 0; i < infos.length; i++) {
      var o = infos[i]
      if (!o.dom) {
        continue
      }
      var left_area = $(o.dom).offset().left
      var top_area = $(o.dom).offset().top
      var right_area = $(o.dom).offset().left + $(o.dom).width()
      var bottom_area = $(o.dom).offset().top + $(o.dom).height()
      if (screenLeft > left_area && screenLeft < right_area && screenTop > top_area && screenTop < bottom_area) {
        area = o.type
        break
      }
    }
    /**拖拽在临近四边的时候，容易筛选不到区域，这时候取最近的一条边作为方向 */
    if (area == '') {
      // var currentContainer_top = $(this.$el).offset().top
      // var currentContainer_bottom = $(this.$el).offset().top + $(this.$el).height()
      // var currentContainer_left = $(this.$el).offset().left
      // var currentContainer_right = $(this.$el).offset().left + $(this.$el).width()
      // var distanceArr = []
      // distanceArr.push({ type: 'up', val: Math.abs(currentContainer_top - screenTop) })
      // distanceArr.push({ type: 'down', val: Math.abs(currentContainer_bottom - screenTop) })
      // distanceArr.push({ type: 'left', val: Math.abs(currentContainer_left - screenLeft) })
      // distanceArr.push({ type: 'right', val: Math.abs(currentContainer_right - screenLeft) })
      // distanceArr.sort((a, b) => {
      //   if (a.val > b.val) {
      //     return 1
      //   } else {
      //     return -1
      //   }
      // })
      // area = distanceArr[0].type
    }
    return area
  }

  private listenOnDragOver(el: Element): boolean {
    this.IsListenedDrop = true
    // window.console.log("接收到DragOver", this.$el);
    return false
  }

  private listenOnDragOut(el: Element, targetContainer: Element): boolean {
    this.IsListenedDrop = false
    // window.console.log("接收到DragOut", this.$el);
    this.clearBoarder()
    return false
  }

  // ***********添加组件**************************************************************************
  /**添加组件，返回的有可能是移动的组件 */
  public AddComponent(comp: ComponentBase) {
    if (!this.centerCol.vueComp) {
      this.onlyAddComp(comp)
    } else if (this.centerCol.vueComp instanceof ComponentBase) {
      //销毁原有组件
      var currentcomp = this.centerCol.vueComp as ComponentBase
      //创建新的cell节点，替换原来的组件dom节点
      var maincell = this.replaceMainArea()
      this.centerCol.vueComp = maincell
      //在新的cell节点中加载原来的组件
      maincell.AddComponent(currentcomp)
      maincell.$on('onCellEmpty', this.removeCell)
      //添加目标组件
      var cell = this.addCellInArea()
      cell.AddComponent(comp)
      cell.$on('onCellEmpty', this.removeCell)
    } else {
      var cell = this.addCellInArea()
      cell.AddComponent(comp)
      cell.$on('onCellEmpty', this.removeCell)
    }
    this.cuteSize()
    this.IsListenedDrop = false
  }

  private onlyAddComp(comp: ComponentBase) {
    this.centerCol.vueComp = comp
    this.compArea.replaceWith(this.centerCol.vueComp.$el)
    // this.centerCol.vueComp.$mount(this.compArea)
    $(this.centerCol.vueComp.$el).css('width', '100%')
    $(this.centerCol.vueComp.$el).css('height', '100%')
  }

  private removeCell(cell: LayoutCell): void {
    window.console.log('removeCell', cell.$el)
    window.console.log('removeCell-maincell', this.$el)
    let isDestroyed = false
    if (this.upRow.vueComp === cell) {
      this.upRow.vueComp.$destroy()
      $(this.upRow.vueComp.$el).remove()
      this.upRow = new rowData()
      this.upRow.layoutRow = this.$refs['upRow'] as Row
      this.upRow.height = '0%'
      isDestroyed = true
    }
    if (this.downRow.vueComp === cell) {
      // window.console.log("downRow");
      this.downRow.vueComp.$destroy()
      $(this.downRow.vueComp.$el).remove()
      this.downRow = new rowData()
      this.downRow.layoutRow = this.$refs['downRow'] as Row
      this.downRow.height = '0%'
      isDestroyed = true
    }
    if (this.centerCol.vueComp === cell) {
      // window.console.log("centerCol");
      this.centerCol.vueComp.$destroy()
      $(this.centerCol.vueComp.$el).remove()
      this.centerCol = new colData()
      this.centerCol.layoutCol = this.$refs['centerCol'] as Col
      this.centerCol.height = '0%'
      this.centerCol.span = 0
      this.centerRow.height = '0%'
      isDestroyed = true
    }
    if (this.leftCol.vueComp === cell) {
      // window.console.log("leftCol");
      this.leftCol.vueComp.$destroy()
      $(this.leftCol.vueComp.$el).remove()
      this.leftCol = new colData()
      this.leftCol.layoutCol = this.$refs['leftCol'] as Col
      this.leftCol.height = '0%'
      this.leftCol.span = 0
      // $(this.leftCol.layoutCol.$el).css("width", "0%");
      // $(this.leftCol.layoutCol.$el).css("height", "0%");
      isDestroyed = true
    }
    if (this.rightCol.vueComp === cell) {
      // window.console.log("rightCol");
      this.rightCol.vueComp.$destroy()
      $(this.rightCol.vueComp.$el).remove()
      this.rightCol = new colData()
      this.rightCol.layoutCol = this.$refs['rightCol'] as Col
      this.rightCol.height = '0%'
      this.rightCol.span = 0
      // $(this.rightCol.layoutCol.$el).css("width", "0%");
      // $(this.rightCol.layoutCol.$el).css("height", "0%");
      isDestroyed = true
    }
    if (isDestroyed) {
      this.cuteSize()
      this.$nextTick(() => {
        if (!this.upRow.vueComp && !this.downRow.vueComp && !this.leftCol.vueComp && !this.rightCol.vueComp && !this.centerCol.vueComp) {
          window.console.log('removeCell-onCellEmpty')
          this.onCellEmpty(this)
        }
      })
    }
    //return isDestroyed;
  }

  /** 删除cell里的组件 */
  public removeCenterColComp() {
    this.centerCol.vueComp.$destroy()
    $(this.centerCol.vueComp.$el).remove()
    var maincell = this.replaceMainArea()
    this.centerCol.vueComp = maincell
    this.centerCol = new colData()
    this.centerCol.layoutCol = this.$refs['centerCol'] as Col
    this.centerCol.height = '0%'
    this.centerCol.span = 0
    this.centerRow.height = '0%'
    this.cuteSize()
    this.$nextTick(() => {
      this.onCellEmpty(this)
    })
  }

  private addCellInArea(): LayoutCell {
    var domarea = null
    var layoutcell = new LayoutCell()
    switch (this.DropArea) {
      case dragArea.drag_up_inner:
        this.upRow.vueComp = layoutcell
        domarea = this.compArea_up
        break
      case dragArea.drag_down_inner:
        this.downRow.vueComp = layoutcell
        domarea = this.compArea_down
        break
      case dragArea.drag_left_inner:
        this.leftCol.vueComp = layoutcell
        domarea = this.compArea_left
        break
      case dragArea.drag_right_inner:
        this.rightCol.vueComp = layoutcell
        domarea = this.compArea_right
        break
      default:
        break
    }
    layoutcell.$mount(domarea)
    $(layoutcell.$el).css('width', '100%')
    $(layoutcell.$el).css('height', '100%')
    return layoutcell
  }
  private replaceMainArea() {
    var newdomId = common.getUuid()
    // window.console.log(currentcomp.$el)
    $(this.centerCol.layoutCol.$el).html('')
    //使用原有组件数据，创建新组件
    $(this.centerCol.layoutCol.$el).append('<div id="' + newdomId + '"></div>')
    //创建新的layoutcell
    var newcell = new LayoutCell()
    newcell.$mount('#' + newdomId)
    return newcell
  }
  // ***********样式重组**************************************************************************
  public cuteSize() {
    // window.console.log('计算尺寸')
    var rowCount = 0
    if (this.upRow.vueComp) {
      rowCount += 1
    }
    if (this.leftCol.vueComp || this.centerCol.vueComp || this.rightCol.vueComp) {
      rowCount += 1
    }
    if (this.downRow.vueComp) {
      rowCount += 1
    }
    var rowHeight = 100 / rowCount + '%'
    if (this.upRow.vueComp) {
      this.upRow.height = rowHeight
    }
    if (this.leftCol.vueComp || this.centerCol.vueComp || this.rightCol.vueComp) {
      this.centerRow.height = rowHeight
    }
    if (this.downRow.vueComp) {
      this.downRow.height = rowHeight
    }
    /******************************************* */
    var colCount = 0
    if (this.leftCol.vueComp) {
      colCount += 1
    }
    if (this.centerCol.vueComp) {
      colCount += 1
    }
    if (this.rightCol.vueComp) {
      colCount += 1
    }

    var colSpan = parseInt((24 / colCount).toString())
    if (this.leftCol.vueComp) {
      this.leftCol.span = colSpan
    }
    if (this.centerCol.vueComp) {
      this.centerCol.span = colSpan
    }
    if (this.rightCol.vueComp) {
      this.rightCol.span = 24 - colSpan * (colCount - 1)
    }
  }

  private onDragSize(el: Element, sourceContainer: Element) {}
  // ***********数据保存与加载**************************************************************************
  public getData(): dataForSave {
    var data = new dataForSave()
    if (this.upRow && this.upRow.vueComp) {
      data.upRowData = new rowDataForSave()
      data.upRowData.height = this.upRow.height
      data.upRowData.width = this.upRow.width
      data.upRowData.layotCellData = this.upRow.vueComp.getData()
    }
    if (this.downRow && this.downRow.vueComp) {
      data.downRowData = new rowDataForSave()
      data.downRowData.height = this.downRow.height
      data.downRowData.width = this.downRow.width
      data.downRowData.layotCellData = this.downRow.vueComp.getData()
    }
    if (this.centerRow) {
      data.centerRowData = new rowDataForSave()
      data.centerRowData.height = this.centerRow.height
      data.centerRowData.width = this.centerRow.width
    }

    if (this.leftCol && this.leftCol.vueComp) {
      data.leftColData = new colDataForSave()
      data.leftColData.height = this.leftCol.height
      data.leftColData.span = this.leftCol.span
      data.leftColData.layotCellData = (this.leftCol.vueComp as LayoutCell).getData()
    }
    if (this.rightCol && this.rightCol.vueComp) {
      data.rightColData = new colDataForSave()
      data.rightColData.height = this.rightCol.height
      data.rightColData.span = this.rightCol.span
      data.rightColData.layotCellData = (this.rightCol.vueComp as LayoutCell).getData()
    }
    if (this.centerCol && this.centerCol.vueComp) {
      data.centerColData = new colDataForSave()
      data.centerColData.height = this.centerCol.height
      data.centerColData.span = this.centerCol.span
      if (this.centerCol.vueComp instanceof ComponentBase) {
        data.centerColData.layotCellData = this.centerCol.vueComp.GetSaveData()
      } else {
        data.centerColData.layotCellData = (this.centerCol.vueComp as LayoutCell).getData()
      }
    }
    return data
  }

  public createCellByData(data: dataForSave) {
    //////***** */
    if (data.centerColData && data.centerColData.layotCellData.centerColData) {
      var cell = this.replaceMainArea()
      this.centerCol.vueComp = cell
      this.centerCol.height = data.centerColData.height
      this.centerCol.span = data.centerColData.span
    } else {
      this.centerCol.vueComp = null
      this.centerCol.height = data.centerColData.height
      this.centerCol.span = data.centerColData.span
    }
    if (data.leftColData) {
      this.DropArea = dragArea.drag_left_inner
      this.addCellInArea()
      this.leftCol.height = data.leftColData.height
      this.leftCol.span = data.leftColData.span
    }
    if (data.rightColData) {
      this.DropArea = dragArea.drag_right_inner
      this.addCellInArea()
      this.rightCol.height = data.rightColData.height
      this.rightCol.span = data.rightColData.span
    }

    if (data.upRowData) {
      this.DropArea = dragArea.drag_up_inner
      this.addCellInArea()
      this.upRow.height = data.upRowData.height
      this.upRow.width = data.upRowData.width
    }
    if (data.downRowData) {
      this.DropArea = dragArea.drag_down_inner
      this.addCellInArea()
      this.downRow.height = data.downRowData.height
      this.downRow.width = data.downRowData.width
    }

    if (data.centerRowData) {
      this.centerRow.height = data.centerRowData.height
      this.centerRow.width = data.centerRowData.width
    }
  }

  /*** 发布cell组件里是空的事件，以让父类cell删除当前cell */
  @Emit('onCellEmpty')
  private onCellEmpty(layoutCell: LayoutCell): void {}
}
</script>

<style scoped>
</style>